import type { Subject, SimulationTool, NptelCourse, YouTubeResource, GateSubject, UserProfile } from '../types';

// Bump this version whenever sampleSubjects data changes (additions, removals, swaps, edits)
export const SUBJECTS_DATA_VERSION = 2;

export const initialProfile: UserProfile = {
  id: '',
  name: 'Student',
  email: '',
  role: 'student',
  branch: 'Electronics and Communication Engineering',
  year: 2,
  streakDays: 0,
  bestStreakDays: 0,
  completedBosSubjects: 0,
  totalBosSubjects: 30,
  completedGateTopics: 0,
  totalGateTopics: 65,
};

// Trusted administrator emails: cannot be elevated client-side by user signup
export const TRUSTED_ADMIN_EMAILS = [
  'admin.ece@rgukt.edu.in',
  'hod.ece@rgukt.edu.in',
  'admin@slh.edu'
];

export const sampleSubjects: Subject[] = [
  // Year 1 - Semester 1
  {
    id: 'sub-y1s1-1',
    year: 1,
    semester: 1,
    code: '20MA1101',
    name: 'Differential Equations and Multivariable Calculus',
    shortForm: 'DE&MC',
    description: 'Calculus of multiple variables, ordinary differential equations, vector calculus, and engineering applications.',
    resources: [
      { id: 'res-3', title: 'Matrices & Linear Transformations.pdf', type: 'notes', fileSize: '3.1 MB', uploadedAt: '2024-08-18' }
    ]
  },
  {
    id: 'sub-y1s1-2',
    year: 1,
    semester: 1,
    code: '20PY1101',
    name: 'Engineering Physics',
    shortForm: 'EP',
    description: 'Waves and oscillations, optics, lasers, fiber optics, quantum mechanics, and solid-state physics.',
    resources: []
  },
  {
    id: 'sub-y1s1-3',
    year: 1,
    semester: 1,
    code: '20PY1181',
    name: 'Engineering Physics Lab',
    shortForm: 'EP Lab',
    description: 'Laboratory experiments in optics, lasers, semiconductor characteristics, and optical fiber measurements.',
    resources: []
  },
  {
    id: 'sub-y1s1-4',
    year: 1,
    semester: 1,
    code: '20CE1114',
    name: 'Engineering Graphics and Design',
    shortForm: 'EGD',
    description: 'Engineering drawing principles, orthographic projections, isometric views, sectioning, and CAD drawing tools.',
    resources: []
  },
  {
    id: 'sub-y1s1-5',
    year: 1,
    semester: 1,
    code: '20EE1110',
    name: 'Electrical Technology',
    shortForm: 'ET',
    description: 'DC circuits, AC circuits, magnetic circuits, transformers, and electrical machines fundamentals.',
    resources: [
      { id: 'res-1', title: 'Circuit Fundamentals - Module 1.pdf', type: 'pdf', fileSize: '2.4 MB', uploadedAt: '2024-08-15' },
      { id: 'res-2', title: 'ET Complete Official Syllabus.pdf', type: 'syllabus', fileSize: '420 KB', uploadedAt: '2024-08-10' }
    ]
  },
  {
    id: 'sub-y1s1-6',
    year: 1,
    semester: 1,
    code: '20EE1180',
    name: 'Electrical Technology Lab',
    shortForm: 'ET Lab',
    description: 'Practical verification of network theorems, transformer loading tests, and DC/AC machine characteristics.',
    resources: []
  },
  {
    id: 'sub-y1s1-7',
    year: 1,
    semester: 1,
    code: '20EC1102',
    name: 'Introduction to Latest Technical Advancements',
    shortForm: 'ILTA',
    description: 'Overview of modern emerging engineering trends, smart electronics, edge devices, and technological innovations.',
    resources: []
  },
  {
    id: 'sub-y1s1-8',
    year: 1,
    semester: 1,
    code: '20CS1108',
    name: 'Programming & Data Structures',
    shortForm: 'PDS',
    description: 'Structured programming in C, pointers, memory allocation, arrays, stacks, queues, and linked lists.',
    resources: []
  },
  {
    id: 'sub-y1s1-9',
    year: 1,
    semester: 1,
    code: '20CS1188',
    name: 'Programming & Data Structures Lab',
    shortForm: 'PDS Lab',
    description: 'Hands-on laboratory programming exercises on C syntax, algorithms, data structures, and debugging.',
    resources: []
  },

  // Year 1 - Semester 2
  {
    id: 'sub-y1s2-1',
    year: 1,
    semester: 2,
    code: '20MA1201',
    name: 'Mathematical Methods',
    shortForm: 'MM',
    description: 'Numerical methods, root finding, numerical integration, solutions of ODEs, and Fourier series analysis.',
    resources: []
  },
  {
    id: 'sub-y1s2-2',
    year: 1,
    semester: 2,
    code: '20CS1209',
    name: 'Object Oriented Programming',
    shortForm: 'OOP',
    description: 'OOP concepts, classes, inheritance, polymorphism, templates, exception handling, and standard libraries.',
    resources: []
  },
  {
    id: 'sub-y1s2-3',
    year: 1,
    semester: 2,
    code: '20CS1289',
    name: 'Object Oriented Programming Laboratory',
    shortForm: 'OOP Lab',
    description: 'Practical object-oriented software design, class design, encapsulation, and interface implementation.',
    resources: []
  },
  {
    id: 'sub-y1s2-4',
    year: 1,
    semester: 2,
    code: '20EC1285',
    name: 'Computational Lab',
    shortForm: 'Comp Lab',
    description: 'Numerical computations, scripting, scientific plotting, and simulation modeling using Python and MATLAB.',
    resources: []
  },
  {
    id: 'sub-y1s2-5',
    year: 1,
    semester: 2,
    code: '20EG1281',
    name: 'English-Language Communication Skills Lab-1',
    shortForm: 'ELCS Lab-1',
    description: 'Phonetics, accent training, listening comprehension, group discussions, and formal presentation skills.',
    resources: []
  },
  {
    id: 'sub-y1s2-6',
    year: 1,
    semester: 2,
    code: '20EC1201',
    name: 'Electronic Devices and Circuits',
    shortForm: 'EDC',
    description: 'Semiconductor physics, PN junction diodes, BJT and MOSFET characteristics, biasing and small-signal models.',
    resources: [
      { id: 'res-4', title: 'Semiconductor Physics Hand-written Notes.pdf', type: 'notes', fileSize: '4.8 MB', uploadedAt: '2024-09-02' },
      { id: 'res-5', title: 'BJT Amplifiers & Biasing Formula Sheet.pdf', type: 'pdf', fileSize: '1.2 MB', uploadedAt: '2024-09-12' }
    ]
  },
  {
    id: 'sub-y1s2-7',
    year: 1,
    semester: 2,
    code: '20EC1281',
    name: 'Electronic Devices and Circuits Lab',
    shortForm: 'EDC Lab',
    description: 'Hardware characterization of diodes, transistors, rectifiers, clippers, clampers, and amplifier circuits.',
    resources: []
  },
  {
    id: 'sub-y1s2-8',
    year: 1,
    semester: 2,
    code: '20EE1211',
    name: 'Network Theory',
    shortForm: 'NT',
    description: 'Network theorems, transient analysis, two-port parameters, resonance, and state variables in electrical networks.',
    resources: []
  },
  {
    id: 'sub-y1s2-9',
    year: 1,
    semester: 2,
    code: '23EC1203',
    name: 'Signals and Systems',
    shortForm: 'SS',
    description: 'Continuous and discrete time signals, LTI systems, Fourier series & transform, Laplace transform, and Z-transform.',
    resources: [
      { id: 'res-6', title: 'Signals and Systems Notes.pdf', type: 'pdf', fileSize: '5.2 MB', uploadedAt: '2024-09-20' },
      { id: 'res-7', title: 'Fourier Series & Transform Summary.pdf', type: 'notes', fileSize: '1.8 MB', uploadedAt: '2024-09-25' }
    ]
  },
  // Year 2 - Semester 1
  {
    id: 'sub-y2s1-1',
    year: 2,
    semester: 1,
    code: '20MA2101',
    name: 'Probability & Random Variables',
    shortForm: 'PRV',
    description: 'Probability axioms, random variables, probability distributions, joint distributions, random processes, and spectral density.',
    resources: []
  },
  {
    id: 'sub-y2s1-2',
    year: 2,
    semester: 1,
    code: '20EC2185',
    name: 'Internet of Things Lab',
    shortForm: 'IoT Lab',
    description: 'Microcontroller programming, sensor interfacing, IoT protocols (MQTT, HTTP), and cloud telemetry dashboards.',
    resources: []
  },
  {
    id: 'sub-y2s1-3',
    year: 2,
    semester: 1,
    code: '20EC2101',
    name: 'Analog Electronic Circuits',
    shortForm: 'AEC',
    description: 'Multistage amplifiers, feedback amplifiers, oscillators, power amplifiers, and tuned amplifier circuits.',
    resources: []
  },
  {
    id: 'sub-y2s1-4',
    year: 2,
    semester: 1,
    code: '20EC2181',
    name: 'Analog Electronic Circuits Lab',
    shortForm: 'AEC Lab',
    description: 'Design and hardware testing of multistage amplifiers, tuned amplifiers, feedback configurations, and RC/LC oscillators.',
    resources: []
  },
  {
    id: 'sub-y2s1-5',
    year: 2,
    semester: 1,
    code: '20EC2102',
    name: 'Digital Logic Design',
    shortForm: 'DLD',
    description: 'Boolean algebra, logic minimization, combinational logic, sequential state machines, counters, and registers.',
    resources: [
      { id: 'res-9', title: 'K-Maps and Finite State Machines Cheatsheet.pdf', type: 'pdf', fileSize: '2.1 MB', uploadedAt: '2024-10-10' }
    ]
  },
  {
    id: 'sub-y2s1-6',
    year: 2,
    semester: 1,
    code: '20EC2182',
    name: 'Digital Logic Design Lab',
    shortForm: 'DLD Lab',
    description: 'Practical realization of combinational and sequential digital circuits using discrete ICs and HDL simulation.',
    resources: []
  },
  {
    id: 'sub-y2s1-7',
    year: 2,
    semester: 1,
    code: '20EC2103',
    name: 'Digital Signal Processing',
    shortForm: 'DSP',
    description: 'DFT, FFT algorithms, FIR and IIR digital filter design, multirate processing, and finite word length effects.',
    resources: []
  },
  {
    id: 'sub-y2s1-8',
    year: 2,
    semester: 1,
    code: '20EC2183',
    name: 'Digital Signal Processing Lab',
    shortForm: 'DSP Lab',
    description: 'Implementation of DFT/FFT, FIR/IIR filter design, and real-time audio/signal filtering using MATLAB/DSP processors.',
    resources: []
  },
  {
    id: 'sub-y2s1-9',
    year: 2,
    semester: 1,
    code: '20EE2104',
    name: 'Control Systems',
    shortForm: 'CS',
    description: 'Transfer functions, block diagram reduction, Bode plots, Nyquist criterion, root locus, and state-space analysis.',
    resources: [
      { id: 'res-10', title: 'Bode & Nyquist Stability Quick Revision.pdf', type: 'notes', fileSize: '2.9 MB', uploadedAt: '2024-11-01' }
    ]
  },

  // Year 2 - Semester 2
  {
    id: 'sub-y2s2-1',
    year: 2,
    semester: 2,
    code: '20EC2285',
    name: 'Robotics Laboratory',
    shortForm: 'Robotics Lab',
    description: 'Kinematics, actuators, sensor integration, robotic arm trajectory planning, and robot operating system (ROS).',
    resources: []
  },
  {
    id: 'sub-y2s2-2',
    year: 2,
    semester: 2,
    code: '20EC2201',
    name: 'Communication Systems-1',
    shortForm: 'CS-1',
    description: 'Analog modulation (AM, FM, PM), transmitter and receiver architectures, noise analysis in analog communication.',
    resources: []
  },
  {
    id: 'sub-y2s2-3',
    year: 2,
    semester: 2,
    code: '20EC2281',
    name: 'Communication Systems-1 Lab',
    shortForm: 'CS-1 Lab',
    description: 'Hardware experimentation with AM/FM modulation, demodulation, frequency synthesizers, and spectrum analysis.',
    resources: []
  },
  {
    id: 'sub-y2s2-4',
    year: 2,
    semester: 2,
    code: '20EC2202',
    name: 'Digital System Design',
    shortForm: 'DSD',
    description: 'Hardware description languages (Verilog), synthesis, programmable logic devices (FPGA/CPLD), and timing simulation.',
    resources: []
  },
  {
    id: 'sub-y2s2-5',
    year: 2,
    semester: 2,
    code: '20EC2282',
    name: 'Digital System Design Lab',
    shortForm: 'DSD Lab',
    description: 'FPGA prototyping of finite state machines, arithmetic units, memory interfaces, and Verilog testbenches.',
    resources: []
  },
  {
    id: 'sub-y2s2-6',
    year: 2,
    semester: 2,
    code: '20EC2203',
    name: 'Linear Integrated Circuits',
    shortForm: 'LIC',
    description: 'Op-amp internal stages, active filters, 555 timers, phase-locked loops (PLL), voltage regulators, and ADC/DAC converters.',
    resources: [
      { id: 'res-8', title: 'Operational Amplifier Configurations & Lab Notes.pdf', type: 'notes', fileSize: '3.7 MB', uploadedAt: '2024-10-05' }
    ]
  },
  {
    id: 'sub-y2s2-7',
    year: 2,
    semester: 2,
    code: '20EC2283',
    name: 'Linear Integrated Circuits Lab',
    shortForm: 'LIC Lab',
    description: 'Experimental testing of op-amp circuits, precision rectifiers, active filters, timer multivibrators, and PLLs.',
    resources: []
  },
  {
    id: 'sub-y2s2-8',
    year: 2,
    semester: 2,
    code: '20EC2204',
    name: 'Electromagnetic Waves & Guided Media',
    shortForm: 'EMWGM',
    description: 'Maxwell equations, electromagnetic wave propagation, reflection and refraction, transmission lines, and Smith chart.',
    resources: [
      { id: 'res-11', title: 'Smith Chart & Transmission Line Notes.pdf', type: 'notes', fileSize: '4.1 MB', uploadedAt: '2024-11-10' }
    ]
  },
  {
    id: 'sub-y2s2-9',
    year: 2,
    semester: 2,
    code: '23EC2205',
    name: 'Foundations to Artificial Intelligence',
    shortForm: 'FAI',
    description: 'Introduction to artificial intelligence concepts, search algorithms, knowledge representation, reasoning, and machine learning fundamentals.',
    resources: []
  },

  // Year 3 - Semester 1
  {
    id: 'sub-y3s1-1',
    year: 3,
    semester: 1,
    code: '20EC3102',
    name: 'Computer Networks',
    shortForm: 'CN',
    description: 'OSI and TCP/IP protocol stacks, data link framing, routing algorithms, transport protocols (TCP/UDP), and socket programming.',
    resources: []
  },
  {
    id: 'sub-y3s1-2',
    year: 3,
    semester: 1,
    code: '20EC3103',
    name: 'Computer Organization & Architecture',
    shortForm: 'COA',
    description: 'Instruction set architecture, processor datapath and control unit, pipelining, hazards, cache memory, and virtual memory.',
    resources: []
  },
  {
    id: 'sub-y3s1-3',
    year: 3,
    semester: 1,
    code: '20EG3182',
    name: 'English-Language Communication Skills Lab-2',
    shortForm: 'ELCS Lab-2',
    description: 'Technical report writing, executive summaries, workplace communication, mock interviews, and professional discourse.',
    resources: []
  },
  {
    id: 'sub-y3s1-4',
    year: 3,
    semester: 1,
    code: '20EC3101',
    name: 'Communication Systems-2',
    shortForm: 'CS-2',
    description: 'Digital communication techniques (PCM, DPCM, DM), digital modulation (ASK, FSK, PSK, QAM), and matched filter detection.',
    resources: []
  },
  {
    id: 'sub-y3s1-5',
    year: 3,
    semester: 1,
    code: '20EC3181',
    name: 'Communication Systems-2 Lab',
    shortForm: 'CS-2 Lab',
    description: 'Experimental testing of pulse code modulation, digital carrier modulation (QPSK, QAM), and bit-error-rate measurement.',
    resources: []
  },
  {
    id: 'sub-y3s1-6',
    year: 3,
    semester: 1,
    code: '20EC3182',
    name: 'Microprocessors, Microcontrollers & Computer Networks Lab',
    shortForm: 'MMCN Lab',
    description: 'Assembly programming for 8086/ARM, peripheral interfacing, network packet sniffing, and client-server socket programming.',
    resources: []
  },
  {
    id: 'sub-y3s1-7',
    year: 3,
    semester: 1,
    code: '20EC3185',
    name: 'Radio Frequency & Microwave Engineering Lab',
    shortForm: 'RFME Lab',
    description: 'Microwave bench testing, waveguides, VSWR measurements, directional couplers, Gunn diodes, and horn antenna patterns.',
    resources: []
  },
  {
    id: 'sub-y3s1-8',
    year: 3,
    semester: 1,
    code: '20EC3190',
    name: 'Mini-Project-I (Socially Relevant Project)',
    shortForm: 'MP-I',
    description: 'Design and hardware/software implementation of an engineering prototype addressing community or environmental needs.',
    resources: []
  },
  {
    id: 'sub-y3s1-9',
    year: 3,
    semester: 1,
    code: '20HS3101',
    name: 'Indian Constitution',
    shortForm: 'IC',
    description: 'Preamble, fundamental rights and duties, directive principles, structure of union/state governments, and judicial institutions.',
    resources: []
  },

  // Year 3 - Semester 2
  {
    id: 'sub-y3s2-1',
    year: 3,
    semester: 2,
    code: '20EG3283',
    name: 'English-Language Communication Skills Lab-3',
    shortForm: 'ELCS Lab-3',
    description: 'Advanced group dynamics, corporate presentations, debate, leadership communication, and technical paper writing.',
    resources: []
  },
  {
    id: 'sub-y3s2-2',
    year: 3,
    semester: 2,
    code: '20BMXY01',
    name: 'Product Design & Innovation',
    shortForm: 'PDI',
    description: 'Design thinking methodology, customer needs analysis, concept generation, rapid prototyping, and business model canvas.',
    resources: []
  },
  {
    id: 'sub-y3s2-3',
    year: 3,
    semester: 2,
    code: '20EC32XX-1',
    name: 'Program Elective Course 1 (Antenna & Wave Propagation / Embedded Systems)',
    shortForm: 'PEC-1',
    description: 'Specialized elective in communication systems, signal processing, or VLSI/embedded architectures.',
    resources: []
  },
  {
    id: 'sub-y3s2-4',
    year: 3,
    semester: 2,
    code: '20EC32XX-2',
    name: 'Program Elective Course 2 (Digital Image Processing / Analog IC Design)',
    shortForm: 'PEC-2',
    description: 'Advanced elective covering digital image filtering, computer vision, or analog integrated circuit engineering.',
    resources: []
  },
  {
    id: 'sub-y3s2-5',
    year: 3,
    semester: 2,
    code: '20XX32XX-1',
    name: 'Open Elective Course 1',
    shortForm: 'OEC-1',
    description: 'Interdisciplinary elective course selected from computer science, management, or other allied engineering disciplines.',
    resources: []
  },
  {
    id: 'sub-y3s2-6',
    year: 3,
    semester: 2,
    code: '20XX32XX-2',
    name: 'Open Elective Course 2',
    shortForm: 'OEC-2',
    description: 'Multidisciplinary open elective providing breadth of engineering knowledge in sustainable technologies or data science.',
    resources: []
  },
  {
    id: 'sub-y3s2-7',
    year: 3,
    semester: 2,
    code: '20EC3291',
    name: 'Mini Project-II',
    shortForm: 'MP-II',
    description: 'Research-oriented project development focusing on simulation, design modeling, and domain experimentation.',
    resources: []
  },
  {
    id: 'sub-y3s2-8',
    year: 3,
    semester: 2,
    code: '20MC3201',
    name: 'Career Development Course',
    shortForm: 'CDC',
    description: 'Quantitative aptitude, logical reasoning, verbal skills, resume building, and technical interview preparation.',
    resources: []
  },

  // Year 4 - Semester 1
  {
    id: 'sub-y4s1-1',
    year: 4,
    semester: 1,
    code: '20EC41XX-1',
    name: 'Program Elective Course 3 (VLSI Testing & Verification / Wireless Communications)',
    shortForm: 'PEC-3',
    description: 'In-depth focus on advanced wireless cellular topologies or semiconductor manufacturing testing and fault modeling.',
    resources: []
  },
  {
    id: 'sub-y4s1-2',
    year: 4,
    semester: 1,
    code: '20EC41XX-2',
    name: 'Program Elective Course 4 (Machine Learning / RF IC Design)',
    shortForm: 'PEC-4',
    description: 'Deep dive into machine learning models for signal intelligence, neural networks, or high-frequency RF IC front-ends.',
    resources: []
  },
  {
    id: 'sub-y4s1-3',
    year: 4,
    semester: 1,
    code: '20XX41XX-1',
    name: 'Open Elective Course 3',
    shortForm: 'OEC-3',
    description: 'Advanced interdisciplinary course offering exposure to modern cross-domain engineering principles.',
    resources: []
  },
  {
    id: 'sub-y4s1-4',
    year: 4,
    semester: 1,
    code: '20EC4192',
    name: 'Summer Internship Project',
    shortForm: 'SIP',
    description: 'Industry internship training report and presentation on real-world practical industrial assignments and systems.',
    resources: []
  },
  {
    id: 'sub-y4s1-5',
    year: 4,
    semester: 1,
    code: '20EC4193',
    name: 'Project I',
    shortForm: 'PROJ-I',
    description: 'Capstone project phase 1: literature review, problem formulation, system specifications, and initial architecture design.',
    resources: []
  },
  {
    id: 'sub-y4s1-6',
    year: 4,
    semester: 1,
    code: '20BE4101',
    name: 'Environmental Science',
    shortForm: 'ES',
    description: 'Ecology, biodiversity conservation, pollution control, climate change, renewable energy, and environmental sustainability.',
    resources: []
  },

  // Year 4 - Semester 2
  {
    id: 'sub-y4s2-1',
    year: 4,
    semester: 2,
    code: '20HS4299',
    name: 'Community Service',
    shortForm: 'CS-Serv',
    description: 'Fieldwork and social outreach program promoting community engagement, rural tech literacy, and health/education awareness.',
    resources: []
  },
  {
    id: 'sub-y4s2-2',
    year: 4,
    semester: 2,
    code: '20EC42XX-1',
    name: 'Program Elective Course 5 (Optical Communications / Deep Learning)',
    shortForm: 'PEC-5',
    description: 'Advanced elective covering high-speed fiber-optic links or deep neural network architectures and transformer models.',
    resources: []
  },
  {
    id: 'sub-y4s2-3',
    year: 4,
    semester: 2,
    code: '20XX42XX-1',
    name: 'Open Elective Course 4',
    shortForm: 'OEC-4',
    description: 'Final multi-disciplinary course exploring emerging technologies, intellectual property rights, or industrial management.',
    resources: []
  },
  {
    id: 'sub-y4s2-4',
    year: 4,
    semester: 2,
    code: '20EC4294',
    name: 'Project-II & Dissertation',
    shortForm: 'PROJ-II',
    description: 'Comprehensive capstone project implementation, validation, prototype fabrication, thesis dissertation, and defense.',
    resources: []
  }
];

export const simulationTools: SimulationTool[] = [
  // --- Dedicated Interactive Lab Simulators ---
  {
    id: 'tool-mosfet',
    name: 'MOSFET Analyser',
    category: 'Semiconductor Devices',
    description: 'Interactive MOSFET I-V characteristic curve plotter, threshold voltage extractor, and bias operating point calculator.',
    iconName: 'Activity',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['20EC1201', '20EC2101', 'EC2101'],
    isExternal: true
  },
  {
    id: 'tool-kmap',
    name: 'K-Map Solver',
    category: 'Digital Design',
    description: 'Visual 2 to 5-variable Karnaugh Map minimizer with SOP/POS simplification, prime implicants, and Don\'t Care states.',
    iconName: 'Grid',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['20EC2102', 'EC2202'],
    isExternal: true
  },
  {
    id: 'tool-logic-converter',
    name: 'Digital Logic Code Converter',
    category: 'Number Systems & HDL',
    description: 'Multi-radix converter between Binary, BCD, Excess-3, Gray Code, Hexadecimal, and HDL bit-vectors.',
    iconName: 'Binary',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['20EC2102', '20EC2202', 'EC2202'],
    isExternal: true
  },
  {
    id: 'tool-gate-builder',
    name: 'Logic Gate Builder',
    category: 'Combinational Logic',
    description: 'Interactive digital schematic canvas for wiring AND, OR, NOT, NAND, NOR, and XOR gates with real-time logic probing.',
    iconName: 'CircuitBoard',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['20EC2102', '20EC2182', 'EC2202'],
    isExternal: true
  },
  {
    id: 'tool-signal-analyzer',
    name: 'Signal Analyzer',
    category: 'Signals & Systems',
    description: 'Time and frequency domain oscilloscope simulator for continuous and discrete signals, FFT spectrums, and convolution.',
    iconName: 'LineChart',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['23EC1203', '20EC2103', 'EC2102'],
    isExternal: true
  },
  {
    id: 'tool-iot-guide',
    name: 'IoT Guide',
    category: 'Embedded & IoT',
    description: 'Hardware pinouts, sensor wiring diagrams, MQTT/HTTP payload formats, and edge firmware development blueprints.',
    iconName: 'Wifi',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['20EC2185', '20EC3182'],
    isExternal: true
  },
  {
    id: 'tool-maths-lab',
    name: 'Maths Lab',
    category: 'Engineering Mathematics',
    description: 'Interactive mathematical computation, calculus visualizations, matrix algebra solvers, and differential equation modeling.',
    iconName: 'Calculator',
    url: '', // Awaiting TinyURL link
    linkedSubjects: ['20MA2101', '20EC1285', 'MA1101', 'MA1201'],
    isExternal: true
  },

  // --- Industry Simulation & Laboratory EDA Suites ---
  {
    id: 'tool-matlab',
    name: 'MATLAB & Simulink',
    category: 'Computation & DSP',
    description: 'High-level matrix computation, signal processing toolbox, filter design, and block-diagram simulation for dynamic systems.',
    iconName: 'Cpu',
    url: 'https://www.mathworks.com/products/matlab.html',
    linkedSubjects: ['23EC1203', '20EC2103', '20EE2104', 'EC2102', 'EC3101', 'EC3201'],
    isExternal: true
  },
  {
    id: 'tool-proteus',
    name: 'Proteus VSM',
    category: 'Microcontroller Co-Simulation',
    description: 'Virtual system modeling combining schematic capture, mixed-mode SPICE, PCB design, and MCU firmware debugging.',
    iconName: 'CircuitBoard',
    url: 'https://www.labcenter.com/',
    linkedSubjects: ['20EC2102', '20EC2202', '20EC3182', 'EC2202', 'EC3101'],
    isExternal: true
  },
  {
    id: 'tool-arduino',
    name: 'Arduino Cloud & IDE',
    category: 'Embedded Systems',
    description: 'Open-source prototyping platform, C++ firmware compiler, board manager, and web editor for microcontrollers.',
    iconName: 'Code',
    url: 'https://www.arduino.cc/',
    linkedSubjects: ['20EC2185', '20EC3182', '20EE1110'],
    isExternal: true
  },
  {
    id: 'tool-ltspice',
    name: 'LTspice Simulator',
    category: 'Analog Simulation',
    description: 'High-performance SPICE simulation software, schematic capture, AC/DC sweep, and waveform viewer for analog circuit design.',
    iconName: 'Zap',
    url: 'https://www.analog.com/en/resources/design-tools-and-calculators/ltspice-simulator.html',
    linkedSubjects: ['20EC1201', '20EC2101', '20EC2203', 'EC2101', 'EC2201'],
    isExternal: true
  },
  {
    id: 'tool-multisim',
    name: 'NI Multisim',
    category: 'Electronic Workbench',
    description: 'Interactive schematic capture and SPICE circuit simulation platform for educational labs and breadboard validation.',
    iconName: 'Sliders',
    url: 'https://www.ni.com/en/support/downloads/software-products/download.multisim.html',
    linkedSubjects: ['20EE1110', '20EC1201', '20EC2203', 'EC1101', 'EC2201'],
    isExternal: true
  },
  {
    id: 'tool-easyeda',
    name: 'EasyEDA',
    category: 'PCB & Circuit Design',
    description: 'Web-based EDA suite with schematic capture, SPICE simulation, and PCB design layout with 3D component preview.',
    iconName: 'Layers',
    url: 'https://easyeda.com/',
    linkedSubjects: ['20EC2102', '20EC2182', '20EC3182'],
    isExternal: true
  },
  {
    id: 'tool-tinkercad',
    name: 'Tinkercad Circuits',
    category: 'Virtual Breadboard & Circuits',
    description: 'Interactive 3D electronics simulation, virtual breadboard wiring, Arduino microcontrollers, and sensor simulation.',
    iconName: 'Box',
    url: 'https://www.tinkercad.com/circuits',
    linkedSubjects: ['20EE1110', '20EC1201', '20EC2185'],
    isExternal: true
  }
];

export const nptelCourses: NptelCourse[] = [
  {
    id: 'nptel-1',
    title: 'Analog Electronic Circuits',
    instructor: 'Prof. Radhakrishna Rao / Prof. S.C. Dutta Roy',
    institute: 'IIT Madras',
    subject: 'Analog Circuits',
    subjectCode: 'EC2201',
    url: 'https://nptel.ac.in/courses/117106030',
    lectureCount: 40
  },
  {
    id: 'nptel-2',
    title: 'Digital Electronic Circuits & Systems',
    instructor: 'Prof. S. Srinivasan',
    institute: 'IIT Madras',
    subject: 'Digital Circuits',
    subjectCode: 'EC2202',
    url: 'https://nptel.ac.in/courses/117106086',
    lectureCount: 40
  },
  {
    id: 'nptel-3',
    title: 'Signals and Systems',
    instructor: 'Prof. V. M. Gadre',
    institute: 'IIT Bombay',
    subject: 'Signals and Systems',
    subjectCode: 'EC2102',
    url: 'https://nptel.ac.in/courses/117101055',
    lectureCount: 40
  },
  {
    id: 'nptel-4',
    title: 'Digital Signal Processing (DSP)',
    instructor: 'Prof. S. C. Dutta Roy',
    institute: 'IIT Delhi',
    subject: 'Digital Signal Processing',
    subjectCode: 'EC3102',
    url: 'https://nptel.ac.in/courses/117102060',
    lectureCount: 40
  },
  {
    id: 'nptel-5',
    title: 'Control Engineering',
    instructor: 'Prof. Ramkrishna Pasumarthy',
    institute: 'IIT Madras',
    subject: 'Control Systems',
    subjectCode: 'EC3101',
    url: 'https://nptel.ac.in/courses/108106098',
    lectureCount: 38
  },
  {
    id: 'nptel-6',
    title: 'Principles of Modern CDMA/MIMO/OFDM Wireless Communications',
    instructor: 'Prof. Aditya K. Jagannatham',
    institute: 'IIT Kanpur',
    subject: 'Communication Systems',
    subjectCode: 'EC4201',
    url: 'https://nptel.ac.in/courses/117104099',
    lectureCount: 42
  },
  {
    id: 'nptel-7',
    title: 'Electromagnetic Theory and Transmission Lines',
    instructor: 'Prof. Pradeep Kumar K.',
    institute: 'IIT Kanpur',
    subject: 'Electromagnetics',
    subjectCode: 'EC2204',
    url: 'https://nptel.ac.in/courses/117104118',
    lectureCount: 40
  },
  {
    id: 'nptel-8',
    title: 'VLSI Design Verification & Testing',
    instructor: 'Prof. Santanu Chattopadhyay',
    institute: 'IIT Kharagpur',
    subject: 'VLSI',
    subjectCode: 'EC3201',
    url: 'https://nptel.ac.in/courses/106105165',
    lectureCount: 35
  },
  {
    id: 'nptel-9',
    title: 'Embedded Systems Design with ARM',
    instructor: 'Prof. Kamalika Datta & Prof. Indranil Sengupta',
    institute: 'IIT Kharagpur',
    subject: 'Embedded Systems',
    subjectCode: 'EC3203',
    url: 'https://nptel.ac.in/courses/106105193',
    lectureCount: 36
  },
  {
    id: 'nptel-10',
    title: 'Semiconductor Devices and Technology (EDC)',
    instructor: 'Prof. Nandita DasGupta',
    institute: 'IIT Madras',
    subject: 'Analog Circuits',
    subjectCode: 'EC2101',
    url: 'https://nptel.ac.in/courses/117106033',
    lectureCount: 40
  }
];

export const youtubeResources: YouTubeResource[] = [
  {
    id: 'yt-1',
    channelName: 'Neso Academy - ECE',
    title: 'Digital Electronics & Microprocessors Complete Series',
    category: 'Digital Electronics',
    subject: 'Core ECE',
    url: 'https://www.youtube.com/@nesoacademy',
    recommendedFor: 'Clear foundational logic gates, flip flops, and boolean reduction.',
    isPlaylist: true
  },
  {
    id: 'yt-2',
    channelName: 'Gate Smashers',
    title: 'ECE Core Concepts & Fast Revision',
    category: 'GATE / Core Subjects',
    subject: 'GATE Preparation',
    url: 'https://www.youtube.com/@GateSmashers',
    recommendedFor: 'Intuitive exam-oriented conceptual breakdowns and problem solving.',
    isPlaylist: true
  },
  {
    id: 'yt-3',
    channelName: 'All About Electronics',
    title: 'Analog Electronics, Operational Amplifiers & Filter Design',
    category: 'Analog Circuits',
    subject: 'Core ECE',
    url: 'https://www.youtube.com/@AllAboutElectronics',
    recommendedFor: 'Step-by-step circuit derivations, waveforms, and practical simulation demos.',
    isPlaylist: true
  },
  {
    id: 'yt-4',
    channelName: 'VLSI For All',
    title: 'CMOS Inverters, Static Timing Analysis & Layouts',
    category: 'VLSI & Semiconductor',
    subject: 'VLSI Design',
    url: 'https://www.youtube.com/@vlsiforall',
    recommendedFor: 'Physical design, verilog testbenches, and industry-standard ASIC flows.',
    isPlaylist: true
  },
  {
    id: 'yt-5',
    channelName: 'MATLAB Official Channel',
    title: 'MATLAB & Simulink for Signal Processing & Controls',
    category: 'Simulation & Coding',
    subject: 'MATLAB',
    url: 'https://www.youtube.com/@MATLAB',
    recommendedFor: 'Official tutorials on FFT, filter design, bode plots, and state-space simulation.',
    isPlaylist: true
  },
  {
    id: 'yt-6',
    channelName: 'Andreas Spiess',
    title: 'Practical Embedded Systems, ESP32, Sensors & IoT',
    category: 'Microcontrollers & IoT',
    subject: 'Embedded & Arduino',
    url: 'https://www.youtube.com/@AndreasSpiess',
    recommendedFor: 'In-depth engineering measurements, SPI/I2C protocols, and ESP32 programming.',
    isPlaylist: false
  },
  {
    id: 'yt-7',
    channelName: 'w2aew (Alan Wolke)',
    title: 'Back to Basics: Oscilloscopes, RF, Transistors & Circuit Lab',
    category: 'Practical Electronics',
    subject: 'Practical Electronics',
    url: 'https://www.youtube.com/@w2aew',
    recommendedFor: 'Hands-on hardware debugging, impedance matching, and bench testing demonstrations.',
    isPlaylist: true
  },
  {
    id: 'yt-8',
    channelName: 'DroneBot Workshop',
    title: 'Arduino & ESP32 Robotics and Hardware Interfacing',
    category: 'Microcontrollers & IoT',
    subject: 'Embedded & Arduino',
    url: 'https://www.youtube.com/@Dronebotworkshop',
    recommendedFor: 'Step-by-step circuit wiring and sketches for microcontrollers and actuators.',
    isPlaylist: true
  },
  {
    id: 'yt-9',
    channelName: 'Unacademy GATE - ECE',
    title: 'GATE ECE PYQ Walkthroughs & Subject Marathons',
    category: 'GATE / Core Subjects',
    subject: 'GATE Preparation',
    url: 'https://www.youtube.com/@UnacademyGATE_ECE',
    recommendedFor: 'Comprehensive previous years question breakdowns with time-saving techniques.',
    isPlaylist: true
  }
];

export const gateSubjects: GateSubject[] = [
  {
    id: 'gate-math',
    name: 'Engineering Mathematics',
    code: 'MATH',
    weightage: '13-15 Marks',
    icon: 'Calculator',
    topicsCount: 8,
    completedTopics: 0,
    syllabus: ['Linear Algebra: Matrix algebra, systems of linear equations, eigenvalues', 'Calculus: Mean value theorems, theorems of integral calculus, partial derivatives', 'Differential Equations: First order equations, higher order linear equations', 'Complex Variables: Analytic functions, Cauchy-Riemann equations', 'Probability and Statistics: Sampling theorems, conditional probability, mean, variance', 'Numerical Methods: Solutions of non-linear algebraic equations, integration methods'],
    pyqCount: 45,
    notesAvailable: true
  },
  {
    id: 'gate-net',
    name: 'Network Theory',
    code: 'NET',
    weightage: '8-10 Marks',
    icon: 'Network',
    topicsCount: 6,
    completedTopics: 0,
    syllabus: ['Network solution methods: nodal and mesh analysis', 'Network theorems: superposition, Thevenin and Norton, maximum power transfer', 'Transient response of dc and ac networks', 'Sinusoidal steady-state analysis', 'Resonance, Two-port networks'],
    pyqCount: 52,
    notesAvailable: true
  },
  {
    id: 'gate-sig',
    name: 'Signals & Systems',
    code: 'SIG',
    weightage: '8-10 Marks',
    icon: 'Activity',
    topicsCount: 7,
    completedTopics: 0,
    syllabus: ['Continuous and discrete time signals', 'Linear Time Invariant (LTI) systems', 'Fourier series and Fourier transform', 'Laplace Transform and Z-transform', 'Sampling theorem and reconstruction'],
    pyqCount: 48,
    notesAvailable: true
  },
  {
    id: 'gate-edc',
    name: 'Electronic Devices (EDC)',
    code: 'EDC',
    weightage: '9-11 Marks',
    icon: 'Radio',
    topicsCount: 6,
    completedTopics: 0,
    syllabus: ['Energy bands in intrinsic and extrinsic silicon', 'Carrier transport: diffusion current, drift current, mobility and resistivity', 'Generation and recombination of carriers, Poisson and continuity equations', 'P-N junction diode, Zener diode, BJT, MOS capacitor, MOSFET'],
    pyqCount: 60,
    notesAvailable: true
  },
  {
    id: 'gate-analog',
    name: 'Analog Circuits',
    code: 'ANA',
    weightage: '10-12 Marks',
    icon: 'Volume2',
    topicsCount: 7,
    completedTopics: 0,
    syllabus: ['Small signal equivalent circuits of diodes, BJTs and MOSFETs', 'Simple diode circuits: clipping, clamping and rectifiers', 'Single-stage and multi-stage BJT and MOSFET amplifiers', 'Operational amplifiers: ideal characteristics and linear/nonlinear applications', 'Active filters, Sinusoidal oscillators and 555 timers'],
    pyqCount: 65,
    notesAvailable: true
  },
  {
    id: 'gate-dig',
    name: 'Digital Circuits',
    code: 'DIG',
    weightage: '8-10 Marks',
    icon: 'Binary',
    topicsCount: 6,
    completedTopics: 0,
    syllabus: ['Number representations: binary, integer and floating-point numbers', 'Combinational circuits: Boolean algebra, minimization functions, logic gates, multiplexers, decoders', 'Sequential circuits: latches, flip-flops, counters, shift registers, finite state machines', 'Data converters: ADC and DAC architectures', 'Semiconductor memories: ROM, SRAM, DRAM'],
    pyqCount: 50,
    notesAvailable: true
  },
  {
    id: 'gate-ctrl',
    name: 'Control Systems',
    code: 'CTRL',
    weightage: '8-10 Marks',
    icon: 'Gauge',
    topicsCount: 6,
    completedTopics: 0,
    syllabus: ['Basic control system components; Feedback principle', 'Transfer function, block diagram reduction, signal flow graphs', 'Transient and steady-state analysis of LTI systems', 'Routh-Hurwitz and Nyquist stability criteria, Bode and Root-locus plots', 'State variable model and state transition matrix, controllability and observability'],
    pyqCount: 44,
    notesAvailable: true
  },
  {
    id: 'gate-comm',
    name: 'Communications',
    code: 'COMM',
    weightage: '10-12 Marks',
    icon: 'Send',
    topicsCount: 8,
    completedTopics: 0,
    syllabus: ['Random processes: autocorrelation and power spectral density, properties of white noise', 'Analog communications: amplitude modulation and demodulation, angle modulation', 'Information theory: entropy, mutual information and channel capacity theorem', 'Digital communications: PCM, DPCM, digital modulation schemes (ASK, PSK, FSK, QAM)', 'Matched filter receiver, calculation of bandwidth, SNR and BER for digital modulation'],
    pyqCount: 58,
    notesAvailable: true
  },
  {
    id: 'gate-emft',
    name: 'Electromagnetics (EMFT)',
    code: 'EMFT',
    weightage: '8-10 Marks',
    icon: 'Compass',
    topicsCount: 6,
    completedTopics: 0,
    syllabus: ['Maxwell’s equations: differential and integral forms, boundary conditions', 'Wave equation, Pointing vector; Plane waves and properties: reflection, refraction, polarization', 'Transmission lines: characteristic impedance, reflection coefficient, standing wave ratio, impedance matching', 'Waveguides: modes in rectangular waveguides, boundary conditions, cut-off frequencies', 'Antennas: dipole antennas, radiation pattern, antenna gain'],
    pyqCount: 42,
    notesAvailable: true
  }
];
