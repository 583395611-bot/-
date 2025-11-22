import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DesignInput, StrategyAnalysis } from "../types";

const apiKey = process.env.API_KEY;

// Define the schema strictly to ensure D3 and Recharts compatible data
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    coreConcept: {
      type: Type.STRING,
      description: "设计策略的简短有力概念标题 (例如：'流动连接性'、'静谧绿洲')。请用中文输出。"
    },
    designPrinciples: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "基于需求得出的3-5个关键设计原则。请用中文输出。"
    },
    radarChartData: {
      type: Type.ARRAY,
      description: "用于评估关键绩效指标 (0-100) 的5-6轴雷达图数据。",
      items: {
        type: Type.OBJECT,
        properties: {
          subject: { type: Type.STRING, description: "轴标签，请用中文 (例如：可持续性, 动线, 美学, 成本效率, 社交互动)。" },
          A: { type: Type.NUMBER, description: "该策略的评分 (0-100)。" },
          fullMark: { type: Type.NUMBER, description: "总是 100。" }
        },
        required: ["subject", "A", "fullMark"]
      }
    },
    spatialGraphData: {
      type: Type.OBJECT,
      description: "代表空间邻接关系和用户-空间关系的节点与连线。",
      properties: {
        nodes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "节点的唯一ID。" },
              label: { type: Type.STRING, description: "显示名称，请用中文 (例如：'大堂', 'Z世代', '静音区')。" },
              group: { type: Type.NUMBER, description: "分组ID用于着色 (1=空间, 2=用户, 3=特征)。" },
              type: { type: Type.STRING, enum: ["zone", "user", "element"] }
            },
            required: ["id", "label", "group", "type"]
          }
        },
        links: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              source: { type: Type.STRING, description: "源节点ID。" },
              target: { type: Type.STRING, description: "目标节点ID。" },
              value: { type: Type.NUMBER, description: "连接强度 (1-10)。" }
            },
            required: ["source", "target", "value"]
          }
        }
      },
      required: ["nodes", "links"]
    },
    detailedAnalysis: {
      type: Type.STRING,
      description: "一段详细的Markdown格式策略分析，解释为何选择这些空间关系和指标。请用中文撰写，约两段话。"
    },
    colorPaletteSuggestion: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "4个十六进制颜色代码的数组，建议空间的氛围基调。"
    }
  },
  required: ["coreConcept", "designPrinciples", "radarChartData", "spatialGraphData", "detailedAnalysis", "colorPaletteSuggestion"]
};

export const generateDesignStrategy = async (input: DesignInput): Promise<StrategyAnalysis> => {
  if (!apiKey) {
    throw new Error("API Key not found in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    你是一位世界级的设计策略家和建筑师。
    请分析以下项目，创建一个可视化的前期设计策略。

    项目名称: ${input.projectName}
    设计需求: ${input.requirements}
    目标用户群: ${input.targetUsers}
    空间背景/限制: ${input.spatialContext}

    输出必须是严格符合Schema的有效JSON格式。**所有文本内容必须使用中文输出。**
    
    关于 'spatialGraphData' (空间关系图):
    - 为关键空间区域 (Spatial Zones) 创建节点 (type='zone', group=1)。
    - 为用户群体 (User Groups) 创建节点 (type='user', group=2)。
    - 为关键设计元素/特征 (Design Elements) 创建节点 (type='element', group=3)。
    - 用连线 (links) 连接它们，展示互动、动线或邻近需求。
    
    关于 'radarChartData' (雷达图):
    - 根据项目类型选择5-6个相关维度 (例如医院: 卫生, 流程, 舒适度; 初创公司: 协作, 灵活性, 科技)。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash', // Using flash for speed and structural reliability with JSON
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as StrategyAnalysis;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};