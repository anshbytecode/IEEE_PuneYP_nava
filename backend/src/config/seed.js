const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

const seedDb = async () => {
  try {
    console.log('Verifying and seeding database using Prisma ORM...');
    
    // Seed default admin account if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'yppune@ieee.org';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPassword123';
    
    const adminCheck = await prisma.admin.findUnique({
      where: { email: adminEmail.trim().toLowerCase() }
    });

    if (!adminCheck) {
      console.log('Creating default administrator account...');
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(adminPassword, saltRounds);
      
      await prisma.admin.create({
        data: {
          name: 'IEEE Pune Admin',
          email: adminEmail.trim().toLowerCase(),
          passwordHash: hashedPassword,
          role: 'superadmin'
        }
      });
      console.log(`Seeding complete: Created admin account under "${adminEmail}"`);
    } else {
      console.log('Administrator account already exists in database.');
    }

    // Seed Student Branches if not exists
    const branchCheck = await prisma.studentBranch.count();
    if (branchCheck === 0) {
      console.log('Seeding initial student branches and default committees...');
      
      const branchesList = [
        "All India Shri Shivaji Memorial Society College of Engineering (AISSMS COE)",
        "All India Shri Shivaji Memorial Society Institute of Information Technology (AISSMS IOIT)",
        "Cummins College of Engineering for Women",
        "JSPM’s Rajarshi Shahu College of Engineering",
        "P.E.S. Modern College of Engineering",
        "Pimpri Chinchwad College of Engineering (PCCOE)",
        "Sinhgad College of Engineering",
        "Bharati Vidyapeeth College of Engineering, Pune",
        "College of Engineering Pune (COEP)",
        "International Institute of Information Technology, Pune",
        "JSPM’s Jayawantrao Sawant College of Engineering",
        "Pune Institute of Computer Technology (PICT)",
        "Vishwakarma Institute of Technology (VIT Pune)",
        "Symbiosis Institute of Computer Studies and Research (SICSR)",
        "G.H. Raisoni College of Engineering & Management",
        "MIT Art, Design and Technology University (MIT-ADT)",
        "MIT World Peace University (MIT-WPU)",
        "Marathwada Mitra Mandal’s College of Engineering (MMCOE)",
        "Dr. D. Y. Patil Institute of Technology, Pimpri",
        "Vishwakarma University",
        "Symbiosis Institute of Technology, Pune",
        "CHRIST (Deemed to be University)",
        "Smt. Kashibai Navale College of Engineering",
        "Vishwakarma Institute of Information Technology (VIIT)",
        "D. Y. Patil College of Engineering, Akurdi"
      ];

      for (const name of branchesList) {
        let code = '';
        const match = name.match(/\(([^)]+)\)/);
        if (match && match[1]) {
          code = match[1];
        } else {
          code = name.split(' ').map(w => w[0]).join('').replace(/[^a-zA-Z]/g, '').substring(0, 5).toUpperCase();
        }

        await prisma.studentBranch.create({
          data: {
            name,
            code,
            logoUrl: `https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80`,
            established: new Date('2015-01-01'),
            officers: {
              create: [
                { name: 'Dr. Ritika Ladha', role: 'Counsellor', ieeeNumber: '101238809', email: 'Ritika.ladha@ieee.org', year: 2026 },
                { name: 'Nidhi Dubey', role: 'Chair', ieeeNumber: '98529243', email: 'dubey.nidhi52@gmail.com', year: 2026 },
                { name: 'Vyom Modh', role: 'Vice Chair', ieeeNumber: null, email: 'vyommodh@ieee.org', year: 2026 },
                { name: 'Akshat Chaudhari', role: 'Secretary', ieeeNumber: null, email: 'akshatchaudhari@ieee.org', year: 2026 },
                { name: 'Shivam Markanday', role: 'Treasurer', ieeeNumber: null, email: 'Shivammarkanday@ieee.org', year: 2026 },
                
                { name: 'Dr. Amit Patil', role: 'Counsellor', ieeeNumber: '92110293', email: 'amit.patil@ieee.org', year: 2021 },
                { name: 'Nisha Sharma', role: 'Chair', ieeeNumber: '95123984', email: 'nisha.sharma@gmail.com', year: 2021 },
                
                { name: 'Prof. Sandeep Shinde', role: 'Counsellor', ieeeNumber: '89123019', email: 'sshinde@ieee.org', year: 2018 },
                { name: 'Rahul Deshmukh', role: 'Chair', ieeeNumber: '82103984', email: 'rahul.d@gmail.com', year: 2018 }
              ]
            }
          }
        });
      }
      console.log('Successfully seeded 25 Student Branches with default committees.');
    } else {
      console.log('Student branches already seeded in database.');
    }
  } catch (error) {
    console.warn('Prisma database connection/seeding failed (unreachable database). Continuing server startup...');
    console.error(error.message || error);
  } finally {
    await prisma.$disconnect();
  }
};

module.exports = seedDb;
