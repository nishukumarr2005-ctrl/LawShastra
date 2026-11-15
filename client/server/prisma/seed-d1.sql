-- Seed data for D1 (SQLite) - categories, courses, laws, subcategories, chapters
-- Safe to run on empty DB after 0001_init.sql

-- Categories
INSERT OR IGNORE INTO "Category" ("id","name","slug","description","status","createdAt","updatedAt") VALUES
(1,'Civil Law','civil-law','Civil rights, procedure and property laws','LIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(2,'Commercial Law','commercial-law','Commercial transactions and contract law','LIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,'Banking Law','banking-law','Banking, finance and recovery frameworks','LIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(4,'Criminal Law','criminal-law','Criminal offences and legal procedure','LIVE',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Courses
INSERT OR IGNORE INTO "Course" ("id","title","category","level","duration","status","summary","createdAt","updatedAt") VALUES
(1,'Civil Procedure Essentials','Civil Law','BEGINNER','4 weeks','PUBLISHED','Core principles of civil procedure and court process.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(2,'Contract Drafting and Remedies','Commercial Law','INTERMEDIATE','6 weeks','PUBLISHED','Practical contract drafting and enforceable remedies.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,'Banking Recovery Framework','Banking Law','ADVANCED','5 weeks','DRAFT','Recovery and enforcement under banking law.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Laws
INSERT OR IGNORE INTO "Law" ("id","title","shortTitle","slug","categoryId","jurisdiction","summary","sourceUrl","sourceLabel","status","pdfUrl","pdfExtractedText","createdAt","updatedAt") VALUES
(1,'Code of Civil Procedure, 1908','CPC','code-of-civil-procedure-1908',1,'India','The Code of Civil Procedure governs procedural rules for civil litigation in India, covering suits, appeals, execution and jurisdictional principles.','https://www.indiacode.nic.in/','India Code','PUBLISHED','https://www.indiacode.nic.in/bitstream/123456789/....pdf','Chapter 1: Jurisdiction. The code defines the court’s authority to adjudicate civil disputes. Chapter 2: Pleadings. Parties must set out facts and legal claims clearly.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(2,'Indian Contract Act, 1872','Contract Act','indian-contract-act-1872',2,'India','Rules for contracts, void agreements, consideration, performance and remedies in commercial matters.','https://www.indiacode.nic.in/','India Code','REVIEW','https://www.indiacode.nic.in/handle/123456789/....pdf','Formation of contract includes offer, acceptance and consideration. Remedies include damages, specific performance and rescission.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,'Negotiable Instruments Act, 1881','NI Act','negotiable-instruments-act-1881',3,'India','Legislation governing promissory notes, bills of exchange, cheques and negotiable instruments.','https://www.indiacode.nic.in/','India Code','PUBLISHED','https://www.indiacode.nic.in/bitstream/123456789/....pdf','Promissory notes and bills of exchange must satisfy formal requirements under the legislation. Dishonour of cheques attracts statutory consequences.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(4,'Prevention of Corruption Act, 1988','PCA','prevention-of-corruption-act-1988',4,'India','Framework for investigation and prosecution of offences relating to bribery and corruption.','https://www.indiacode.nic.in/','India Code','DRAFT','https://www.indiacode.nic.in/handle/123456789/....pdf','The act defines offences and the statutory procedures for investigation and prosecution of corruption matters.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Subcategories
INSERT OR IGNORE INTO "Subcategory" ("id","name","lawId","createdAt") VALUES
(1,'Procedural Law',1,CURRENT_TIMESTAMP),
(2,'Civil Remedies',1,CURRENT_TIMESTAMP),
(3,'Evidence',1,CURRENT_TIMESTAMP),
(4,'Contractual Rights',2,CURRENT_TIMESTAMP),
(5,'Remedies',2,CURRENT_TIMESTAMP),
(6,'Financial Instruments',3,CURRENT_TIMESTAMP),
(7,'Commercial Banking',3,CURRENT_TIMESTAMP),
(8,'Anti-Corruption',4,CURRENT_TIMESTAMP),
(9,'Investigative Powers',4,CURRENT_TIMESTAMP);

-- Chapters
INSERT OR IGNORE INTO "Chapter" ("id","lawId","title","content","createdAt","updatedAt") VALUES
(1,1,'Jurisdiction','Rules governing a court’s power to hear and decide a civil matter.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(2,1,'Pleadings','Framework for stating claims, defences and issues in civil litigation.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(3,2,'Formation of Contract','Offer, acceptance, consideration and legal capacity.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(4,2,'Discharge','Modes of discharge of contractual obligations.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(5,3,'Promissory Notes','Rules relating to promissory notes and their legal enforceability.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(6,3,'Cheques','Presentation, dishonour and notice requirements for cheques.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(7,4,'Offences','Offences related to bribery, undue influence and abuse of office.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP),
(8,4,'Prosecution','Procedure for investigating and prosecuting corruption offences.',CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);

-- Default admin user (password for "admin123")
INSERT OR IGNORE INTO "User" ("id","name","email","passwordHash","role","isActive","createdAt","updatedAt") VALUES
(1,'LawShastra Admin','admin@lawshastra.in','$2a$10$EuIQd1kRuxjFqZRhaZNMj.ogh7PgMMYQ9/nHEPK.DqPFoVZ5101OG','SUPER_ADMIN',1,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP);
