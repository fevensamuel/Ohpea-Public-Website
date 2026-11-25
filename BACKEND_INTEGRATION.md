# OHPEA backend integration notes

The official membership form submits multipart/form-data to `POST /api/public/registrations`.

## Compatibility updates
- Loads active regions from `GET /api/public/lookups/regions` and submits the selected region ID as both `regionId` and `region`, matching the backend region resolver.
- Sends the backend's canonical `fullName`, `email`, `phone`, `membershipCategory`, `gender`, `idType`, `idNumber`, `consent`, and `preferredLanguage` fields.
- Sends `officialFormData` as JSON so the backend can preserve the complete official application, including repeatable education, certification, experience, language, expertise, interest, and payment data.
- Keeps structured collections under `educationRecords`, `certificationRecords`, `experienceRecords`, `languageProficiency`, and `paymentMethods` inside `officialFormData` because the current backend also writes legacy top-level properties with some of the original names.
- Uses the exact backend upload field names: `passportPhoto`, `idDocument`, `cvCompanyProfile`, `academicCertificates`, `professionalLicensesBusinessRegistration`, and `paymentProof`.
- Sends accepted file extensions only: PDF, JPG, JPEG, and PNG. The backend enforces a 5 MB per-file limit.
- Keeps required ID document, CV/company profile, region, and declaration checks aligned with backend validation.
- Sends the selected preferred language for all supported website locales: English, Afaan Oromoo, Amharic, Arabic, and French.

## Deployment
The backend must already be deployed with its official-registration migration applied and private upload storage writable. The website must point to that backend using its existing API base URL environment configuration.
