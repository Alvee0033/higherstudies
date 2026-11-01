import 'dotenv/config';

throw new Error(
  'Disabled legacy collector: it treats OpenAlex author search as current faculty and fabricates profile URLs, titles, emails, and fallback topics. Implement an official faculty-directory adapter with review staging before enabling collection.',
);

const API_BASE_URL =
  process.env.API_BASE_URL ||
  `http://${process.env.HOST || '127.0.0.1'}:${process.env.PORT || 4100}`;
const INTERNAL_SECRET =
  process.env.INTERNAL_INGEST_SECRET || 'internal-dev-secret-key-12345';

console.log(`HigherStudy Academic Faculty Collector Service`);
console.log(
  `Connecting to Ingestion Endpoint: ${API_BASE_URL}/v1/internal/ingestion/faculty`,
);

const TARGET_INSTITUTIONS = [
  {
    name: 'Massachusetts Institute of Technology',
    search: 'Massachusetts Institute of Technology',
    domain: 'mit.edu',
    dept: 'Electrical Engineering & Computer Science',
  },
  {
    name: 'Stanford University',
    search: 'Stanford University',
    domain: 'stanford.edu',
    dept: 'Computer Science Department',
  },
  {
    name: 'University of Cambridge',
    search: 'University of Cambridge',
    domain: 'cam.ac.uk',
    dept: 'Department of Computer Science and Technology',
  },
  {
    name: 'University of Oxford',
    search: 'University of Oxford',
    domain: 'ox.ac.uk',
    dept: 'Department of Computer Science',
  },
  {
    name: 'Carnegie Mellon University',
    search: 'Carnegie Mellon University',
    domain: 'cmu.edu',
    dept: 'School of Computer Science',
  },
  {
    name: 'Technical University of Munich',
    search: 'Technical University of Munich',
    domain: 'tum.de',
    dept: 'School of Computation, Information and Technology',
  },
  {
    name: 'Harvard University',
    search: 'Harvard University',
    domain: 'harvard.edu',
    dept: 'John A. Paulson School of Engineering and Applied Sciences',
  },
  {
    name: 'University of California, Berkeley',
    search: 'University of California, Berkeley',
    domain: 'berkeley.edu',
    dept: 'EECS Department',
  },
];

async function fetchAuthorsForInstitution(instName, perPage = 10) {
  const url = `https://api.openalex.org/authors?search=${encodeURIComponent(instName)}&per_page=${perPage}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'HigherStudy-ScholarBot/1.0 (academic-curation@higherstudy.internal)',
        Accept: 'application/json',
      },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.results || [];
  } catch (err) {
    console.warn(`Error querying OpenAlex for ${instName}: ${err.message}`);
    return [];
  }
}

async function postFacultyBatch(items) {
  const res = await fetch(`${API_BASE_URL}/v1/internal/ingestion/faculty`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-internal-key': INTERNAL_SECRET,
    },
    body: JSON.stringify({ items }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Faculty Ingestion API error (${res.status}): ${errText}`);
  }

  return await res.json();
}

async function runFacultyCollector() {
  let totalIngested = 0;

  for (const target of TARGET_INSTITUTIONS) {
    console.log(`\nFetching verified faculty profiles for ${target.name}...`);
    const authors = await fetchAuthorsForInstitution(target.search, 8);

    if (authors.length === 0) {
      console.log(`No records returned for ${target.name}.`);
      continue;
    }

    const batch = [];
    for (const a of authors) {
      const name = a.display_name?.trim();
      if (!name) continue;

      // Extract research topics from OpenAlex concepts/topics
      const topics = [];
      if (Array.isArray(a.topics)) {
        for (const t of a.topics.slice(0, 4)) {
          if (t.display_name) topics.push(t.display_name);
        }
      }
      if (topics.length === 0 && Array.isArray(a.x_concepts)) {
        for (const c of a.x_concepts.slice(0, 3)) {
          if (c.display_name) topics.push(c.display_name);
        }
      }
      if (topics.length === 0) {
        topics.push('Computer Science', 'Machine Learning');
      }

      const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '.');
      const profileUrl =
        a.orcid || a.id || `https://${target.domain}/faculty/${cleanSlug}`;
      const email = `${cleanSlug}@${target.domain}`;

      batch.push({
        institutionName: target.name,
        name: `Prof. ${name}`,
        title:
          a.works_count > 100
            ? 'Distinguished Full Professor'
            : 'Professor and Principal Investigator',
        academicUnit: target.dept,
        officialProfileUrl: profileUrl,
        publicEmail: email,
        researchTopics: topics,
      });
    }

    if (batch.length > 0) {
      try {
        const result = await postFacultyBatch(batch);
        totalIngested += batch.length;
        console.log(
          `✓ [${target.name}] HTTP POST 200 OK -> Accepted: ${result.data.accepted}, Updated: ${result.data.updated} (Batch size: ${batch.length})`,
        );
      } catch (err) {
        console.error(`✗ Error sending batch for ${target.name}:`, err.message);
      }
    }

    // Politeness pause between institutional calls
    await new Promise((r) => setTimeout(r, 600));
  }

  console.log(
    `\n✓ Faculty Collector Finished! Total professors ingested via API: ${totalIngested}`,
  );
}

runFacultyCollector().catch((err) => {
  console.error('Faculty collector error:', err);
  process.exit(1);
});
