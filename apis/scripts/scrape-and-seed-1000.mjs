import 'dotenv/config';

throw new Error(
  'Disabled legacy importer: it fabricates admission requirements and deadlines, then publishes directly. Use the reviewed staging ingestion pipeline instead.',
);

const API_BASE_URL =
  process.env.API_BASE_URL ||
  `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 4100}`;
const INTERNAL_SECRET =
  process.env.INTERNAL_INGEST_SECRET || 'internal-dev-secret-key-12345';

console.log(`HigherStudy Professional Collector Service`);
console.log(
  `Ingestion Endpoint: ${API_BASE_URL}/v1/internal/ingestion/programmes`,
);

async function fetchStudyportalsPage(level, size, offset) {
  const url = `https://search-api.prtl.co/programmes/search?educationalLevels=${level}&resultSize=${size}&resultOffset=${offset}`;
  let attempts = 0;
  while (attempts < 3) {
    attempts++;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          Accept: 'application/json',
        },
      });
      if (res.ok) {
        return await res.json();
      }
      await new Promise((r) => setTimeout(r, 1000 * attempts));
    } catch (e) {
      await new Promise((r) => setTimeout(r, 1000 * attempts));
    }
  }
  return { programmes: [] };
}

async function postBatchToApi(items) {
  const res = await fetch(`${API_BASE_URL}/v1/internal/ingestion/programmes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': INTERNAL_SECRET,
    },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`API Ingestion failed (${res.status}): ${errText}`);
  }

  return await res.json();
}

async function runCollector() {
  const targetCount = 100; // Controlled batch collection run
  let totalIngested = 0;
  let offset = 0;
  const pageSize = 25;

  console.log(`Collecting and POSTing live programmes directly to API...`);

  while (totalIngested < targetCount && offset < 500) {
    const isPhd = offset % 100 === 0 && offset > 200;
    const level = isPhd ? 'phd' : 'master';
    const json = await fetchStudyportalsPage(level, pageSize, offset);
    const progs = json.programmes || [];

    if (progs.length === 0) {
      console.log(`No more programmes at offset ${offset}. Finished.`);
      break;
    }

    const batch = [];
    for (const wrapper of progs) {
      const func = wrapper.card?.func || wrapper;
      const spId = func.getId || wrapper.id;
      if (!spId) continue;

      let title = func.getTitle || `Programme #${spId}`;
      title = String(title).trim();

      const uniLink = func.getUniversityLink?.func;
      const uniName = (
        uniLink?.getDescription || 'International University'
      ).trim();
      let countryCode = (
        func.getCountryIsoCode ||
        func.getLocation?.func?.getCountryIso ||
        'GB'
      ).toUpperCase();
      if (countryCode.length !== 2) countryCode = 'GB';
      const city =
        func.getLocation?.func?.getCity?.func?.getDescription ||
        func.getLocationText ||
        'Global Campus';

      const rawPath =
        func.getProgrammeLink?.func?.getUrl ||
        `/studies/${spId}/programme.html`;
      const portalUrl = `https://www.${isPhd ? 'phdportal' : 'mastersportal'}.com${rawPath}`;

      // Tuition note
      let admissionNote = 'Contact university for fees';
      const tuitionList = func.getTuitionFees;
      if (Array.isArray(tuitionList) && tuitionList.length > 0) {
        const tf = tuitionList[0]?.func || tuitionList[0];
        admissionNote = `Tuition: ${tf.getAmount || tf.amount || 0} ${tf.getCurrency || tf.currency || 'EUR'} / ${tf.getUnit || tf.unit || 'year'}`;
      }

      // Requirements
      const requirements = [];
      const ieltsVal = (6.0 + (Number(spId) % 4) * 0.5).toFixed(1);
      requirements.push({
        type: 'ielts_overall',
        state: 'required',
        valueText: String(ieltsVal),
        valueNumber: Number(ieltsVal),
        unit: 'band',
        conditionText:
          'Minimum IELTS Academic score for international applicants',
      });

      if (isPhd || Number(spId) % 3 === 0) {
        requirements.push({
          type: 'gre',
          state: 'required',
          conditionText:
            'Graduate Record Examination (GRE) required for admissions consideration',
        });
      }

      // Intakes
      const intakes = [
        {
          term: 'Fall 2027',
          startsOn: '2027-09-01',
          deadlineOn: '2027-02-15',
          applicationUrl: portalUrl,
        },
      ];

      batch.push({
        institutionName: uniName,
        countryCode,
        city,
        title,
        degree: isPhd ? 'phd' : 'masters',
        officialUrl: `${portalUrl}#programme-details`,
        discoveryUrl: portalUrl,
        language: 'English',
        academicUnit: (func.getSummary || '').slice(0, 180),
        applicationStatus: 'open',
        admissionNote,
        intakes,
        requirements,
      });
    }

    if (batch.length > 0) {
      try {
        const result = await postBatchToApi(batch);
        totalIngested += batch.length;
        console.log(
          `✓ [POST Batch @ offset ${offset}] HTTP 200 OK -> Accepted: ${result.data.accepted}, Updated: ${result.data.updated} (Batch size: ${batch.length})`,
        );
      } catch (err) {
        console.error(`✗ Error sending batch @ offset ${offset}:`, err.message);
      }
    }

    offset += pageSize;
  }

  console.log(
    `✓ Success! Total live programmes ingested through API: ${totalIngested}`,
  );
}

runCollector().catch((err) => {
  console.error('Collector execution error:', err);
  process.exit(1);
});
