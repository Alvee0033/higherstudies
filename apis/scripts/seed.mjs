import 'dotenv/config';
import pg from 'pg';

if (process.env.ALLOW_DEMO_SEED !== 'true') {
  throw new Error(
    'This script inserts fictional demo records. Set ALLOW_DEMO_SEED=true only in a disposable local database.',
  );
}

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

try {
  console.log('Seeding HigherStudy database...');
  await client.query('BEGIN');

  // 1. Sources
  const sourceRes = await client.query(`
    INSERT INTO source (id, name, base_url, adapter, permission_status, permission_note, enabled, refresh_hours, last_success_at)
    VALUES
      ('a0000000-0000-0000-0000-000000000001', 'MIT Official Admissions', 'https://gradadmissions.mit.edu', 'official-site', 'approved', 'Official university public catalog terms verified', true, 72, now() - interval '4 hours'),
      ('a0000000-0000-0000-0000-000000000002', 'Stanford Graduate Admissions', 'https://gradadmissions.stanford.edu', 'official-site', 'approved', 'Official university catalog access granted', true, 72, now() - interval '6 hours'),
      ('a0000000-0000-0000-0000-000000000003', 'University of Cambridge Postgraduate Admissions', 'https://www.postgraduate.study.cam.ac.uk', 'official-site', 'approved', 'Direct API and crawl agreement compliant with robots.txt', true, 168, now() - interval '12 hours'),
      ('a0000000-0000-0000-0000-000000000004', 'TUM Munich Informatics Portal', 'https://www.cit.tum.de', 'official-site', 'approved', 'Official institutional page parser verified', true, 168, now() - interval '1 day'),
      ('a0000000-0000-0000-0000-000000000005', 'DAAD Scholarship Database', 'https://www.daad.de', 'funder-portal', 'approved', 'Public research funding registry data policy compliant', true, 72, now() - interval '3 hours'),
      ('a0000000-0000-0000-0000-000000000006', 'Oxford University Graduate Studies', 'https://www.ox.ac.uk', 'official-site', 'pending', 'Awaiting domain compliance review', false, 168, null)
    ON CONFLICT (base_url) DO UPDATE SET
      name = EXCLUDED.name,
      permission_status = EXCLUDED.permission_status,
      enabled = EXCLUDED.enabled,
      last_success_at = EXCLUDED.last_success_at
    RETURNING id, name;
  `);
  console.log(`✓ Sources: ${sourceRes.rowCount} verified`);

  // 2. Evidence records
  await client.query(`
    INSERT INTO source_evidence (id, source_id, url, excerpt, content_hash, observed_at, verified_at)
    VALUES
      ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'https://gradadmissions.mit.edu/programs/eecs', 'EECS graduate program admissions requirements for MS and PhD', 'hash_mit_eecs_001', now(), now()),
      ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'https://gradadmissions.stanford.edu/programs/computer-science', 'Stanford CS Department graduate admission criteria and funding', 'hash_stan_cs_002', now(), now()),
      ('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'https://www.postgraduate.study.cam.ac.uk/courses/directory/csciipacs', 'MPhil in Advanced Computer Science course syllabus & language requirement', 'hash_cam_acs_003', now(), now()),
      ('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000004', 'https://www.cit.tum.de/en/cit/studies/degree-programs/master-informatics', 'TUM MSc Informatics admission details, tuition waiver and English criteria', 'hash_tum_inf_004', now(), now()),
      ('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000005', 'https://www.daad.de/en/information-services-for-higher-education-institutions/programmes/detail/?id=50015559', 'DAAD Helmut-Schmidt-Programme for Public Policy and Informatics', 'hash_daad_005', now(), now()),
      ('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000001', 'https://eecs.mit.edu/people/faculty-advisors', 'MIT EECS Faculty Directory & research groups listing', 'hash_mit_fac_006', now(), now()),
      ('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 'https://cs.stanford.edu/people/faculty', 'Stanford Computer Science faculty lab profiles and contacts', 'hash_stan_fac_007', now(), now())
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Source Evidence created');

  // 3. Institutions
  const instRes = await client.query(`
    INSERT INTO institution (id, name, country_code, city, official_url, ror_id, evidence_id, status, verified_at)
    VALUES
      ('c0000000-0000-0000-0000-000000000001', 'Massachusetts Institute of Technology', 'US', 'Cambridge', 'https://www.mit.edu', 'https://ror.org/054e7h768', 'b0000000-0000-0000-0000-000000000001', 'published', now()),
      ('c0000000-0000-0000-0000-000000000002', 'Stanford University', 'US', 'Stanford', 'https://www.stanford.edu', 'https://ror.org/00f54p054', 'b0000000-0000-0000-0000-000000000002', 'published', now()),
      ('c0000000-0000-0000-0000-000000000003', 'University of Cambridge', 'GB', 'Cambridge', 'https://www.cam.ac.uk', 'https://ror.org/013meh722', 'b0000000-0000-0000-0000-000000000003', 'published', now()),
      ('c0000000-0000-0000-0000-000000000004', 'Technical University of Munich', 'DE', 'Munich', 'https://www.tum.de', 'https://ror.org/02kkvpp62', 'b0000000-0000-0000-0000-000000000004', 'published', now()),
      ('c0000000-0000-0000-0000-000000000005', 'University of Oxford', 'GB', 'Oxford', 'https://www.ox.ac.uk', 'https://ror.org/052gg0110', 'b0000000-0000-0000-0000-000000000003', 'published', now())
    ON CONFLICT (official_url) DO UPDATE SET
      name = EXCLUDED.name,
      country_code = EXCLUDED.country_code,
      city = EXCLUDED.city,
      status = 'published',
      verified_at = now()
    RETURNING id, name;
  `);
  console.log(`✓ Institutions: ${instRes.rowCount} published`);

  // 4. Subjects
  await client.query(`
    INSERT INTO subject (id, code, name)
    VALUES
      ('d0000000-0000-0000-0000-000000000001', 'CS', 'Computer Science'),
      ('d0000000-0000-0000-0000-000000000002', 'AI', 'Artificial Intelligence & Machine Learning'),
      ('d0000000-0000-0000-0000-000000000003', 'DS', 'Data Science & Analytics'),
      ('d0000000-0000-0000-0000-000000000004', 'EE', 'Electrical & Electronic Engineering'),
      ('d0000000-0000-0000-0000-000000000005', 'BIO', 'Bioinformatics & Computational Biology')
    ON CONFLICT (code) DO NOTHING;
  `);
  console.log('✓ Subjects created');

  // 5. Departments
  await client.query(`
    INSERT INTO department (id, institution_id, name)
    VALUES
      ('e0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Department of Electrical Engineering & Computer Science'),
      ('e0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Department of Computer Science'),
      ('e0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Department of Computer Science and Technology'),
      ('e0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'School of Computation, Information and Technology')
    ON CONFLICT (institution_id, name) DO NOTHING;
  `);
  console.log('✓ Departments created');

  // 6. Programmes
  const progRes = await client.query(`
    INSERT INTO programme (id, institution_id, subject_id, title, degree, country_code, language, mode, official_url, discovery_url, evidence_id, academic_unit, application_status, admission_note, status, verified_at)
    VALUES
      ('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Master of Science in Electrical Engineering & Computer Science', 'masters', 'US', 'English', 'Full-time On Campus', 'https://eecs.mit.edu/academics/graduate-programs', 'https://gradadmissions.mit.edu/programs/eecs', 'b0000000-0000-0000-0000-000000000001', 'School of Engineering', 'open', 'Direct admission with full research assistantship consideration for Fall term.', 'published', now()),
      ('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'PhD in Computer Science (Artificial Intelligence Track)', 'phd', 'US', 'English', 'Full-time On Campus', 'https://cs.stanford.edu/academics/phd', 'https://gradadmissions.stanford.edu/programs/computer-science', 'b0000000-0000-0000-0000-000000000002', 'Department of Computer Science', 'open', 'All admitted PhD scholars receive guaranteed 5-year full fellowship/RA/TA support.', 'published', now()),
      ('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', 'Master of Philosophy in Advanced Computer Science', 'masters', 'GB', 'English', 'Full-time On Campus', 'https://www.cst.cam.ac.uk/teaching/masters', 'https://www.postgraduate.study.cam.ac.uk/courses/directory/csciipacs', 'b0000000-0000-0000-0000-000000000003', 'Department of Computer Science and Technology', 'open', 'Intensive 9-month taught and research MPhil preparation for doctoral work.', 'published', now()),
      ('f0000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000001', 'Master of Science in Informatics', 'masters', 'DE', 'English', 'Full-time On Campus', 'https://www.cit.tum.de/en/cit/studies/degree-programs/master-informatics/', 'https://www.tum.de/en/studies/degree-programs/detail/informatics-master-of-science-msc', 'b0000000-0000-0000-0000-000000000004', 'School of Computation, Information and Technology', 'open', 'No tuition fee under Bavarian higher education policy; semester contribution only.', 'published', now()),
      ('f0000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'd0000000-0000-0000-0000-000000000003', 'MSc in Statistical Science (Machine Learning & Data Science)', 'masters', 'GB', 'English', 'Full-time On Campus', 'https://www.ox.ac.uk/admissions/graduate/courses/msc-statistical-science', 'https://www.ox.ac.uk/courses/msc-stat-science', 'b0000000-0000-0000-0000-000000000003', 'Department of Statistics', 'open', 'Clarendon and departmental scholarship deadline January 2027.', 'published', now())
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      degree = EXCLUDED.degree,
      country_code = EXCLUDED.country_code,
      academic_unit = EXCLUDED.academic_unit,
      application_status = EXCLUDED.application_status,
      admission_note = EXCLUDED.admission_note,
      status = 'published',
      verified_at = now()
    RETURNING id, title;
  `);
  console.log(`✓ Programmes: ${progRes.rowCount} published`);

  // 7. Programme Intakes
  await client.query(`
    INSERT INTO programme_intake (id, programme_id, term, starts_on, deadline_on, application_url)
    VALUES
      ('11000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'Fall 2027', '2027-09-01', '2026-12-15', 'https://gradadmissions.mit.edu/apply'),
      ('11000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 'Fall 2027', '2027-09-20', '2026-12-01', 'https://gradadmissions.stanford.edu/apply'),
      ('11000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 'Michaelmas 2027', '2027-10-01', '2026-12-03', 'https://www.postgraduate.study.cam.ac.uk/apply'),
      ('11000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000004', 'Winter Semester 2027', '2027-10-01', '2027-05-31', 'https://campus.tum.de/tumonline'),
      ('11000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000005', 'Michaelmas 2027', '2027-10-01', '2027-01-20', 'https://www.ox.ac.uk/admissions/graduate/applying-to-oxford')
    ON CONFLICT (programme_id, term, starts_on) DO NOTHING;
  `);
  console.log('✓ Programme Intakes created');

  // 8. Requirement Claims
  await client.query(`
    INSERT INTO requirement_claim (id, programme_id, evidence_id, type, state, value_text, value_number, unit, condition_text, applicant_group, status, verified_at)
    VALUES
      ('22000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'ielts_overall', 'required', '7.5', 7.50, 'band', 'Minimum 7.0 in each subscore', 'international', 'published', now()),
      ('22000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'gre_quantitative', 'optional', '165', 165.00, 'score', 'GRE scores considered if submitted, not mandatory', 'all', 'published', now()),
      ('22000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'toefl_ibt', 'required', '100', 100.00, 'score', 'Minimum 25 in Speaking & Writing', 'international', 'published', now()),
      ('22000000-0000-0000-0000-000000000004', 'f0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'gpa_minimum', 'required', '3.70', 3.70, 'scale_4_0', 'Preferred undergraduate GPA in technical discipline', 'all', 'published', now()),
      ('22000000-0000-0000-0000-000000000005', 'f0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'ielts_overall', 'required', '7.5', 7.50, 'band', 'At least 7.0 in each individual component', 'international', 'published', now()),
      ('22000000-0000-0000-0000-000000000006', 'f0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'ielts_overall', 'required', '6.5', 6.50, 'band', 'CEFR C1 level proficiency certified', 'international', 'published', now())
    ON CONFLICT (id) DO NOTHING;
  `);
  console.log('✓ Requirement Claims created');

  // 9. Funding Opportunities
  const fundRes = await client.query(`
    INSERT INTO funding_opportunity (id, institution_id, evidence_id, title, provider, official_url, coverage, amount, currency, eligibility, deadline_on, status, verified_at)
    VALUES
      ('33000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'MIT EECS Presidential Graduate Fellowship', 'Massachusetts Institute of Technology', 'https://eecs.mit.edu/academics/graduate-programs/financial-aid', 'Full tuition + $46,800 annual stipend + medical insurance', 46800.00, 'USD', 'Admitted graduate candidates in electrical engineering and computer science', '2026-12-15', 'published', now()),
      ('33000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002', 'Knight-Hennessy Scholars Program', 'Stanford University', 'https://knight-hennessy.stanford.edu', 'Full tuition waiver, comprehensive living stipend and annual travel grant', 60000.00, 'USD', 'Prospective graduate students across all graduate degree programs at Stanford', '2026-10-10', 'published', now()),
      ('33000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Gates Cambridge Scholarship', 'Bill & Melinda Gates Foundation / University of Cambridge', 'https://www.gatescambridge.org', 'Full university fees, maintenance allowance (£20,000/yr), airfare', 48000.00, 'GBP', 'Outstanding applicants from countries outside the UK pursuing postgraduate degrees', '2026-12-03', 'published', now()),
      ('33000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005', 'DAAD Helmut-Schmidt-Programme Postgraduate Fellowship', 'German Academic Exchange Service (DAAD)', 'https://www.daad.de/en/study-and-research-in-germany/scholarships/daad-scholarships/', 'Full living allowance (€934/month), health insurance, travel subsidy', 14500.00, 'EUR', 'Graduates from developing and emerging countries with first-class degrees', '2027-07-31', 'published', now()),
      ('33000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003', 'Clarendon Fund Scholarship', 'University of Oxford', 'https://www.ox.ac.uk/clarendon', 'Full course fees and a generous grant for living expenses', 25000.00, 'GBP', 'All graduate applicants applying by the relevant January course deadline', '2027-01-20', 'published', now())
    ON CONFLICT (official_url) DO UPDATE SET
      title = EXCLUDED.title,
      provider = EXCLUDED.provider,
      coverage = EXCLUDED.coverage,
      amount = EXCLUDED.amount,
      currency = EXCLUDED.currency,
      status = 'published',
      verified_at = now()
    RETURNING id, title;
  `);
  console.log(`✓ Funding Opportunities: ${fundRes.rowCount} published`);

  // 10. Programme Funding linkages
  await client.query(`
    INSERT INTO programme_funding (programme_id, funding_id, evidence_id)
    VALUES
      ('f0000000-0000-0000-0000-000000000001', '33000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001'),
      ('f0000000-0000-0000-0000-000000000002', '33000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000002'),
      ('f0000000-0000-0000-0000-000000000003', '33000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003'),
      ('f0000000-0000-0000-0000-000000000004', '33000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005'),
      ('f0000000-0000-0000-0000-000000000005', '33000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000003')
    ON CONFLICT (programme_id, funding_id) DO NOTHING;
  `);
  console.log('✓ Programme Funding linkages created');

  // 11. Faculty Members
  const facRes = await client.query(`
    INSERT INTO faculty_member (id, institution_id, department_id, evidence_id, name, title, official_profile_url, public_email, research_topics, academic_unit, status, verified_at)
    VALUES
      ('44000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Prof. Jonathan Smith', 'Professor of Computer Science & Engineering', 'https://eecs.mit.edu/people/jonathan-smith', 'jsmith@mit.edu', ARRAY['Machine Learning','Deep Learning','Computer Vision'], 'School of Engineering', 'published', now()),
      ('44000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000006', 'Prof. Maria Chen', 'Associate Professor of Electrical Engineering', 'https://eecs.mit.edu/people/maria-chen', 'mchen@mit.edu', ARRAY['AI Ethics','Robotics','Human-AI Interaction'], 'School of Engineering', 'published', now()),
      ('44000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000007', 'Prof. Arjun Patel', 'Professor of Data Science', 'https://cs.stanford.edu/people/arjun-patel', 'arjun.patel@stanford.edu', ARRAY['Data Mining','Statistical Learning','Big Data'], 'Department of Computer Science', 'published', now()),
      ('44000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000003', 'Dr. Elena Rostova', 'Reader in Machine Intelligence', 'https://www.cst.cam.ac.uk/people/er234', 'elena.rostova@cam.ac.uk', ARRAY['Natural Language Processing','Neurosymbolic AI','Automated Reasoning'], 'Department of Computer Science and Technology', 'published', now()),
      ('44000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000004', 'e0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000004', 'Prof. Dr. Hans Weber', 'Chair for Applied AI and Informatics', 'https://www.cit.tum.de/people/hans-weber', 'h.weber@tum.de', ARRAY['Distributed Systems','Cloud Computing','Cyber-Physical Systems'], 'School of Computation, Information and Technology', 'published', now())
    ON CONFLICT (official_profile_url) DO UPDATE SET
      name = EXCLUDED.name,
      title = EXCLUDED.title,
      public_email = EXCLUDED.public_email,
      research_topics = EXCLUDED.research_topics,
      academic_unit = EXCLUDED.academic_unit,
      status = 'published',
      verified_at = now()
    RETURNING id, name;
  `);
  console.log(`✓ Faculty Members: ${facRes.rowCount} published`);

  // 12. Crawl Jobs
  await client.query(`
    INSERT INTO crawl_job (id, source_id, status, idempotency_key, found_count, accepted_count, error_count, started_at, completed_at)
    VALUES
      ('55000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'completed', 'mit-eecs-fall27-01', 12, 10, 0, now() - interval '4 hours', now() - interval '3 hours 50 minutes'),
      ('55000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'completed', 'stanford-cs-fall27-02', 8, 8, 0, now() - interval '6 hours', now() - interval '5 hours 45 minutes'),
      ('55000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'completed', 'cambridge-postgrad-03', 15, 14, 1, now() - interval '12 hours', now() - interval '11 hours 30 minutes'),
      ('55000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000005', 'completed', 'daad-helmut-04', 5, 5, 0, now() - interval '3 hours', now() - interval '2 hours 55 minutes')
    ON CONFLICT (source_id, idempotency_key) DO NOTHING;
  `);
  console.log('✓ Crawl Jobs created');

  // 13. Staged Records (Needs Review) for Review Queue!
  const stagedRes = await client.query(`
    INSERT INTO staged_record (id, source_id, job_id, record_type, external_id, source_url, payload, content_hash, review_state, version)
    VALUES
      (
        '66000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        '55000000-0000-0000-0000-000000000001',
        'programme',
        'mit-quantum-msc',
        'https://gradadmissions.mit.edu/programs/quantum-science',
        '{"title": "Master of Science in Quantum Science and Technology", "degree": "masters", "institutionId": "c0000000-0000-0000-0000-000000000001", "academicUnit": "School of Science", "applicationStatus": "open", "officialUrl": "https://gradadmissions.mit.edu/programs/quantum-science", "evidenceExcerpt": "Interdisciplinary MS degree spanning physics, mathematics, and EECS quantum hardware labs."}',
        'hash_staged_quantum_001',
        'needs_review',
        1
      ),
      (
        '66000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000002',
        '55000000-0000-0000-0000-000000000002',
        'requirement_claim',
        'stan-cs-gre-waive',
        'https://cs.stanford.edu/admissions/faq',
        '{"programmeId": "f0000000-0000-0000-0000-000000000002", "type": "gre_general", "state": "optional", "valueText": "Not Required", "conditionText": "GRE General and Subject tests are completely optional for Fall 2027 admissions cycle", "evidenceExcerpt": "Applicants may choose whether or not to submit GRE scores; non-submission will not disadvantage applicants."}',
        'hash_staged_gre_002',
        'needs_review',
        1
      ),
      (
        '66000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000005',
        '55000000-0000-0000-0000-000000000004',
        'funding_opportunity',
        'daad-green-hydrogen',
        'https://www.daad.de/en/study-and-research-in-germany/scholarships/green-hydrogen/',
        '{"title": "DAAD Green Hydrogen International Master Fellowship", "provider": "Federal Ministry of Education and Research (BMBF)", "institutionId": "c0000000-0000-0000-0000-000000000004", "officialUrl": "https://www.daad.de/en/study-and-research-in-germany/scholarships/green-hydrogen/", "coverage": "€1,200/month stipend + travel + family allowance", "deadlineOn": "2027-04-15", "evidenceExcerpt": "Fellowship aimed at students focusing on energy systems, green computing and hydrogen tech."}',
        'hash_staged_green_h2_003',
        'needs_review',
        1
      ),
      (
        '66000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000003',
        '55000000-0000-0000-0000-000000000003',
        'faculty_member',
        'cam-fac-prof-thorne',
        'https://www.cst.cam.ac.uk/people/jt890',
        '{"name": "Prof. James Thorne", "title": "Professor of Applied Artificial Intelligence", "institutionId": "c0000000-0000-0000-0000-000000000003", "academicUnit": "Department of Computer Science and Technology", "officialProfileUrl": "https://www.cst.cam.ac.uk/people/jt890", "publicEmail": "james.thorne@cam.ac.uk", "researchTopics": ["Fact Verification", "NLP", "Trustworthy AI"], "evidenceExcerpt": "Leads the Automated Verification & Trustworthy Language Intelligence Lab."}',
        'hash_staged_thorne_004',
        'needs_review',
        1
      )
    ON CONFLICT (id) DO NOTHING
    RETURNING id, record_type;
  `);
  console.log(
    `✓ Staged Records for Review Queue: ${stagedRes.rowCount} created`,
  );

  await client.query('COMMIT');
  console.log('✅ Database successfully seeded!');
} catch (error) {
  await client.query('ROLLBACK');
  console.error('❌ Seeding failed:', error);
  process.exit(1);
} finally {
  await client.end();
}
