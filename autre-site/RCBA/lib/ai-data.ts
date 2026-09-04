export interface CoursePhase {
  id: number;
  title: string;
  description: string;
  lessons: number;
  category: 'Fundamentals' | 'Deep Learning' | 'LLM' | 'Agents' | 'Production';
  skills: string[];
}

export const AI_ENGINEERING_CURRICULUM: CoursePhase[] = [
  {
    id: 0,
    title: "Foundations of AI Engineering",
    description: "Linear algebra, calculus, and classical machine learning from scratch.",
    lessons: 12,
    category: 'Fundamentals',
    skills: ['Matrix Math', 'Derivatives', 'SGD']
  },
  {
    id: 1,
    title: "Deep Learning Foundations",
    description: "Building neural networks from basic units (perceptrons) to deep architectures.",
    lessons: 15,
    category: 'Deep Learning',
    skills: ['Backpropagation', 'Activation Functions', 'Multilayer Perceptron']
  },
  {
    id: 2,
    title: "The Transformer Revolution",
    description: "Understanding attention mechanisms and the architecture that changed everything.",
    lessons: 20,
    category: 'LLM',
    skills: ['Attention', 'Tokenization', 'Positional Encoding']
  },
  {
    id: 3,
    title: "LLM Pre-training & Fine-tuning",
    description: "Scale up. Training models on large datasets and instruction tuning.",
    lessons: 18,
    category: 'LLM',
    skills: ['SFT', 'RLHF', 'PEFT']
  },
  {
    id: 4,
    title: "Autonomous Agents I",
    description: "Creating agents that can use tools and plan their own actions.",
    lessons: 25,
    category: 'Agents',
    skills: ['Tool Choice', 'ReAct', 'Plan & Execute']
  },
  {
    id: 5,
    title: "Multi-Agent Systems",
    description: "Coordination, negotiation, and collective intelligence in agent swarms.",
    lessons: 15,
    category: 'Agents',
    skills: ['Orchestration', 'Consensus', 'Baton Passing']
  },
  {
    id: 6,
    title: "Computer Vision & Visual Reasoning",
    description: "From CNNs to Vision Transformers and visual language grounding.",
    lessons: 14,
    category: 'Deep Learning',
    skills: ['ViT', 'Object Detection', 'Image-to-Text']
  },
  {
    id: 7,
    title: "Generative Audio & Speech AI",
    description: "TTS, STT, and the architecture of modern voice agents.",
    lessons: 12,
    category: 'Deep Learning',
    skills: ['Whisper', 'Waveforms', 'Voice Synthesis']
  },
  {
    id: 8,
    title: "Vector Databases & Search",
    description: "The memory layer of modern AI. Embedding spaces and retrieval algorithms.",
    lessons: 18,
    category: 'Fundamentals',
    skills: ['HNSW', 'Cosine Similarity', 'Pinecone/Milvus']
  },
  {
    id: 9,
    title: "Advanced RAG Pipelines",
    description: "Retrieval Augmented Generation with re-ranking, Hyde, and recursive search.",
    lessons: 22,
    category: 'LLM',
    skills: ['Re-ranking', 'Context Chunks', 'Semantic Cache']
  },
  {
    id: 10,
    title: "Agentic Memory Systems",
    description: "Implementing short-term, long-term, and entity-based memory for agents.",
    lessons: 20,
    category: 'Agents',
    skills: ['Graph Memory', 'Reflexion', 'Context Windows']
  },
  {
    id: 11,
    title: "Evaluations & LLM-as-a-Judge",
    description: "Building automated test suites and using LLMs to grade AI output.",
    lessons: 16,
    category: 'Production',
    skills: ['RAGAS', 'MMLU', 'Custom Rubrics']
  },
  {
    id: 12,
    title: "AI Security & Guardrails",
    description: "Defending against prompt injection, data poisoning, and jailbreaks.",
    lessons: 15,
    category: 'Production',
    skills: ['Pydantic Guard', 'LlamaGuard', 'Adversarial Attacks']
  },
  {
    id: 13,
    title: "Deployment & MLOps",
    description: "CI/CD for AI. Containerization, monitoring, and active learning loops.",
    lessons: 20,
    category: 'Production',
    skills: ['Docker', 'BentoML', 'Model Versioning']
  },
  {
    id: 14,
    title: "Multi-modal Orchestration",
    description: "Building systems that reason across image, text, and audio simultaneously.",
    lessons: 24,
    category: 'LLM',
    skills: ['Clip', 'Stable Diffusion', 'Multi-modal RAG']
  },
  {
    id: 15,
    title: "Reasoning & Chain-of-Thought",
    description: "Deep dive into prompting techniques that unlock latent reasoning.",
    lessons: 12,
    category: 'LLM',
    skills: ['CoT', 'Tree of Thoughts', 'Self-Consistency']
  },
  {
    id: 16,
    title: "Hardware Optimization (CUDA/MPS)",
    description: "Optimizing code for the metal. Quantization and mixed precision training.",
    lessons: 30,
    category: 'Production',
    skills: ['CUDA', 'Flash Attention', 'GGUF']
  },
  {
    id: 17,
    title: "Open Source LLM Sovereignty",
    description: "Deploying Llama, Mistral, and local stacks without cloud dependencies.",
    lessons: 18,
    category: 'LLM',
    skills: ['Ollama', 'vLLM', 'Self-hosting']
  },
  {
    id: 18,
    title: "Neuro-symbolic AI",
    description: "Merging deep learning logic with hard logic and knowledge graphs.",
    lessons: 20,
    category: 'Fundamentals',
    skills: ['Reasoning Loops', 'SPARQL', 'Logic Engines']
  },
  {
    id: 19,
    title: "The Singularity Horizon",
    description: "Frontier research, AGI benchmarks, and the future of agentic coding.",
    lessons: 10,
    category: 'Fundamentals',
    skills: ['AGI Metrics', 'Future-proofing', 'Recursive Improvement']
  }
];

export const TOTAL_PHASES = 20;
