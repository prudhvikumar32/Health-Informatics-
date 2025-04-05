import axios from 'axios';
import { ONETOccupation, ONETSkill, ONETJobDetail } from '@shared/types';

// O*NET API configuration
const ONET_API_KEY = process.env.ONET_API_KEY || 'developer';
const ONET_BASE_URL = 'https://services.onetcenter.org/ws';

// Fetch job details from O*NET API
export async function getONETJobDetails(onetCode: string): Promise<ONETJobDetail> {
  try {
    console.log(`Fetching O*NET job details for occupation ${onetCode}`);
    
    // Try multiple formats if the provided code doesn't work
    // O*NET codes can be in different formats (e.g., "15-1211.00" or "15-1211")
    const codeFormats = [
      onetCode,
      `${onetCode}.00`,
      onetCode.split('.')[0]
    ];
    
    let response;
    let successfulCode = '';
    
    // Try each code format until one works
    for (const code of codeFormats) {
      try {
        response = await axios.get(`${ONET_BASE_URL}/online/occupations/${code}`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${ONET_API_KEY}:`).toString('base64')}`
          },
          params: {
            format: 'json'
          },
          timeout: 5000 // 5 second timeout
        });
        
        // If we get here, the request worked
        successfulCode = code;
        break;
      } catch (formatError) {
        console.log(`O*NET API attempt with code format ${code} failed, trying next format if available`);
      }
    }
    
    if (!response || !successfulCode) {
      throw new Error(`Could not find O*NET data for occupation code ${onetCode} in any format`);
    }
    
    console.log(`Successfully retrieved O*NET data for occupation ${successfulCode}`);
    const data = response.data;
    
    // Fetch skills data in parallel to improve performance
    const skillsPromise = getONETSkills(successfulCode);
    
    // Attempt to fetch knowledge data
    let knowledge = [];
    try {
      const knowledgeResponse = await axios.get(`${ONET_BASE_URL}/online/occupations/${successfulCode}/knowledge`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ONET_API_KEY}:`).toString('base64')}`
        },
        params: {
          format: 'json'
        },
        timeout: 5000
      });
      
      // Parse knowledge data if available
      if (knowledgeResponse.data && knowledgeResponse.data.element) {
        knowledge = knowledgeResponse.data.element.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: 'Knowledge',
          importance: item.ratings.importance * 20, // Scale to 0-100
          level: item.ratings.level * 20 // Scale to 0-100
        }));
      }
    } catch (knowledgeError) {
      console.error('Error fetching O*NET knowledge data:', knowledgeError);
    }
    
    // Attempt to fetch abilities data
    let abilities = [];
    try {
      const abilitiesResponse = await axios.get(`${ONET_BASE_URL}/online/occupations/${successfulCode}/abilities`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${ONET_API_KEY}:`).toString('base64')}`
        },
        params: {
          format: 'json'
        },
        timeout: 5000
      });
      
      // Parse abilities data if available
      if (abilitiesResponse.data && abilitiesResponse.data.element) {
        abilities = abilitiesResponse.data.element.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          category: 'Ability',
          importance: item.ratings.importance * 20, // Scale to 0-100
          level: item.ratings.level * 20 // Scale to 0-100
        }));
      }
    } catch (abilitiesError) {
      console.error('Error fetching O*NET abilities data:', abilitiesError);
    }
    
    // Get the skills data from the promise
    const skills = await skillsPromise;
    
    // Parse the response data
    const jobDetail: ONETJobDetail = {
      code: onetCode,
      title: data.title,
      description: data.description,
      tasks: data.tasks ? data.tasks.map((task: any) => task.description) : [],
      skills,
      knowledge,
      abilities,
      education: data.education ? data.education.map((edu: any) => ({
        level: edu.category,
        percentage: edu.percentage
      })) : [],
      experience: data.experience ? data.experience.map((exp: any) => ({
        level: exp.category,
        percentage: exp.percentage
      })) : []
    };
    
    return jobDetail;
  } catch (error) {
    console.error('Error fetching O*NET job details:', error);
    
    // Try mapping SOC codes to O*NET codes and retry
    if (onetCode.length <= 7) { // If it's a SOC code like "15-1211"
      const mappedCode = `${onetCode}.00`;
      console.log(`Attempting with mapped O*NET code ${mappedCode}`);
      
      try {
        return await getONETJobDetails(mappedCode);
      } catch (mappedError) {
        console.error(`Mapped code attempt also failed:`, mappedError);
      }
    }
    
    console.log(`Falling back to mocked job detail data for ${onetCode}`);
    // Only fallback to mocked data as a last resort
    return getMockedJobDetail(onetCode);
  }
}

// Fetch skills data from O*NET API
export async function getONETSkills(onetCode: string): Promise<ONETSkill[]> {
  try {
    console.log(`Fetching O*NET skills for occupation ${onetCode}`);
    
    // Try multiple formats if the provided code doesn't work
    // O*NET codes can be in different formats (e.g., "15-1211.00" or "15-1211")
    const codeFormats = [
      onetCode,
      `${onetCode}.00`,
      onetCode.split('.')[0]
    ];
    
    let response;
    let successfulCode = '';
    
    // Try each code format until one works
    for (const code of codeFormats) {
      try {
        response = await axios.get(`${ONET_BASE_URL}/online/occupations/${code}/skills`, {
          headers: {
            'Authorization': `Basic ${Buffer.from(`${ONET_API_KEY}:`).toString('base64')}`
          },
          params: {
            format: 'json'
          },
          timeout: 5000 // 5 second timeout
        });
        
        // If we get here, the request worked
        successfulCode = code;
        break;
      } catch (formatError) {
        console.log(`O*NET skills API attempt with code format ${code} failed, trying next format if available`);
      }
    }
    
    if (!response || !successfulCode) {
      throw new Error(`Could not find O*NET skills data for occupation code ${onetCode} in any format`);
    }
    
    console.log(`Successfully retrieved O*NET skills data for occupation ${successfulCode}`);
    const data = response.data;
    
    if (!data.element || !Array.isArray(data.element)) {
      console.warn(`Unexpected O*NET skills data format for ${successfulCode}:`, data);
      throw new Error(`Invalid data format in O*NET skills response`);
    }
    
    // Parse the response data
    const skills: ONETSkill[] = data.element.map((skill: any) => ({
      id: skill.id || `unknown-${Math.random().toString(36).substr(2, 9)}`,
      name: skill.name || 'Unknown Skill',
      description: skill.description || `No description available for ${skill.name}`,
      category: skill.category || 'Uncategorized',
      importance: skill.ratings && skill.ratings.importance ? skill.ratings.importance * 20 : 50, // Scale to 0-100, default 50
      level: skill.ratings && skill.ratings.level ? skill.ratings.level * 20 : 50 // Scale to 0-100, default 50
    }));
    
    // Add some healthcare-specific skills if they're not already included
    const healthcareSpecificSkills = [
      'Electronic Health Records (EHR)',
      'Healthcare Regulations',
      'Clinical Terminology',
      'HL7/FHIR',
      'Patient Data Privacy'
    ];
    
    const skillNames = skills.map(s => s.name.toLowerCase());
    
    // Add healthcare-specific skills only if no skills were found or we need to augment
    if (skills.length === 0 || 
        !healthcareSpecificSkills.some(s => skillNames.includes(s.toLowerCase()))) {
      
      // Add healthcare informatics specific skills
      const additionalSkills = getHealthcareInformaticsSkills(onetCode);
      
      console.log(`Augmenting O*NET skills with ${additionalSkills.length} healthcare informatics skills`);
      
      // Add additional skills but avoid duplicates by checking name
      for (const skill of additionalSkills) {
        if (!skillNames.includes(skill.name.toLowerCase())) {
          skills.push(skill);
          skillNames.push(skill.name.toLowerCase());
        }
      }
    }
    
    return skills;
  } catch (error) {
    console.error('Error fetching O*NET skills:', error);
    
    // Fallback to mocked data for demonstration
    return getMockedSkills();
  }
}

// Helper function to get healthcare informatics specific skills
function getHealthcareInformaticsSkills(onetCode: string): ONETSkill[] {
  // If the occupation code contains these codes, it's likely a healthcare IT role
  const isHealthcareITRole = 
    onetCode.includes('15-12') || // Computer Systems Analysts, Information Security Analysts
    onetCode.includes('15-13') || // Computer and Information Research Scientists
    onetCode.includes('15-15') || // Computer and Information Research Scientists
    onetCode.includes('29-90') || // Health Information Technologists and Medical Registrars
    onetCode.includes('11-91');   // Medical and Health Services Managers
  
  if (isHealthcareITRole) {
    return [
      {
        id: "HI001",
        name: "Electronic Health Records (EHR)",
        description: "Knowledge of electronic systems used to store and process patient health information.",
        category: "Technical Skills",
        importance: 92,
        level: 88
      },
      {
        id: "HI002",
        name: "HL7/FHIR",
        description: "Knowledge of healthcare data exchange standards and protocols.",
        category: "Technical Skills",
        importance: 85,
        level: 78
      },
      {
        id: "HI003",
        name: "Healthcare Regulations",
        description: "Knowledge of healthcare laws, regulations, and compliance requirements like HIPAA.",
        category: "Industry Knowledge",
        importance: 88,
        level: 80
      },
      {
        id: "HI004",
        name: "Clinical Terminology",
        description: "Knowledge of medical vocabulary, coding systems like ICD-10, SNOMED CT, or CPT.",
        category: "Industry Knowledge",
        importance: 82,
        level: 75
      },
      {
        id: "HI005",
        name: "Healthcare Analytics",
        description: "Ability to interpret healthcare data and derive meaningful insights.",
        category: "Technical Skills",
        importance: 87,
        level: 82
      }
    ];
  }
  
  // Generic skills for all health occupations
  return [
    {
      id: "HG001",
      name: "Patient Data Privacy",
      description: "Understanding of patient privacy requirements and data protection measures.",
      category: "Compliance",
      importance: 90,
      level: 85
    },
    {
      id: "HG002",
      name: "Healthcare Systems",
      description: "Knowledge of healthcare delivery systems and operations.",
      category: "Industry Knowledge",
      importance: 80,
      level: 75
    },
    {
      id: "HG003",
      name: "Health Informatics",
      description: "Application of information science to healthcare data management and analysis.",
      category: "Technical Skills",
      importance: 85,
      level: 80
    }
  ];
}

// Helper function with mocked job detail data
function getMockedJobDetail(onetCode: string): ONETJobDetail {
  const mockJobDetails: Record<string, ONETJobDetail> = {
    "15-1211.01": {
      code: "15-1211.01",
      title: "Health Informatics Specialist",
      description: "Apply knowledge of healthcare and information systems to assist in the design, development, and operation of health information systems.",
      tasks: [
        "Design, develop, and modify healthcare information systems.",
        "Test health information software or systems.",
        "Document healthcare software specifications or requirements.",
        "Analyze healthcare data to identify patterns.",
        "Provide technical support for health information systems."
      ],
      skills: getMockedSkills(),
      knowledge: [],
      abilities: [],
      education: [
        { level: "Bachelor's degree", percentage: 65 },
        { level: "Master's degree", percentage: 25 },
        { level: "Associate's degree", percentage: 10 }
      ],
      experience: [
        { level: "3-5 years", percentage: 45 },
        { level: "1-2 years", percentage: 30 },
        { level: "6+ years", percentage: 25 }
      ]
    },
    "15-2051.01": {
      code: "15-2051.01",
      title: "Health Data Scientist",
      description: "Apply data mining, data modeling, natural language processing, and machine learning to extract and analyze information from healthcare data.",
      tasks: [
        "Develop predictive models for healthcare outcomes.",
        "Transform healthcare data into actionable insights.",
        "Create data visualizations to communicate findings.",
        "Design algorithms to extract insights from healthcare data.",
        "Work with healthcare providers to identify data needs."
      ],
      skills: getMockedSkills(),
      knowledge: [],
      abilities: [],
      education: [
        { level: "Master's degree", percentage: 60 },
        { level: "Bachelor's degree", percentage: 30 },
        { level: "Doctoral degree", percentage: 10 }
      ],
      experience: [
        { level: "3-5 years", percentage: 50 },
        { level: "6+ years", percentage: 30 },
        { level: "1-2 years", percentage: 20 }
      ]
    }
  };
  
  return mockJobDetails[onetCode] || {
    code: onetCode,
    title: "Healthcare Informatics Professional",
    description: "Apply knowledge of healthcare and technology to improve health information systems and patient care.",
    tasks: [
      "Develop healthcare software applications.",
      "Analyze health data to improve patient outcomes.",
      "Implement electronic health record systems.",
      "Train healthcare staff on information systems.",
      "Ensure compliance with healthcare privacy regulations."
    ],
    skills: getMockedSkills(),
    knowledge: [],
    abilities: [],
    education: [
      { level: "Bachelor's degree", percentage: 60 },
      { level: "Master's degree", percentage: 30 },
      { level: "Associate's degree", percentage: 10 }
    ],
    experience: [
      { level: "3-5 years", percentage: 45 },
      { level: "1-2 years", percentage: 35 },
      { level: "6+ years", percentage: 20 }
    ]
  };
}

// Helper function with mocked skills data
function getMockedSkills(): ONETSkill[] {
  return [
    {
      id: "2.B.1.e",
      name: "Electronic Health Records (EHR)",
      description: "Knowledge of electronic systems used to store and process patient health information.",
      category: "Technical Skills",
      importance: 92,
      level: 88
    },
    {
      id: "2.B.3.b",
      name: "SQL/Databases",
      description: "Knowledge of database query languages and database management.",
      category: "Technical Skills",
      importance: 85,
      level: 80
    },
    {
      id: "2.B.3.k",
      name: "Data Analysis",
      description: "Ability to inspect, transform, and model data to discover useful information.",
      category: "Technical Skills",
      importance: 78,
      level: 75
    },
    {
      id: "2.B.3.j",
      name: "HL7/FHIR",
      description: "Knowledge of healthcare data exchange standards and protocols.",
      category: "Technical Skills",
      importance: 65,
      level: 60
    },
    {
      id: "2.A.1.a",
      name: "Communication",
      description: "Ability to effectively convey information to others.",
      category: "Soft Skills",
      importance: 88,
      level: 85
    },
    {
      id: "2.B.2.i",
      name: "Problem Solving",
      description: "Ability to identify complex problems and review related information to develop solutions.",
      category: "Soft Skills",
      importance: 82,
      level: 80
    },
    {
      id: "2.A.1.b",
      name: "Teamwork",
      description: "Ability to work collaboratively with others to achieve goals.",
      category: "Soft Skills",
      importance: 76,
      level: 75
    },
    {
      id: "2.B.5.a",
      name: "Project Management",
      description: "Knowledge of principles and methods for planning, coordinating, and managing projects.",
      category: "Soft Skills",
      importance: 70,
      level: 65
    }
  ];
}
