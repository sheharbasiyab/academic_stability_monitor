import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PredictiveInsights {
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  prediction: string;
  recommendations: string[];
  projectedGPA: number;
  attendanceWarning?: string;
}

export interface SubjectRecoveryAdvice {
  strategy: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  steps: string[];
  estimatedPassProbability: number;
}

export const getPredictiveInsights = async (studentData: any): Promise<PredictiveInsights> => {
  const prompt = `
    Analyze the following student academic data and provide predictive insights.
    Data: ${JSON.stringify(studentData)}
    
    Consider:
    - Attendance threshold is 75%.
    - Internal marks are out of 50. Passing is 23.
    - Activity points required: 100.
    - Credits required for promotion.
    - Historical GPA trends.
    
    Provide a JSON response with:
    - riskLevel: 'Low', 'Moderate', 'High', or 'Critical'
    - prediction: A 2-sentence summary of where the student is headed.
    - recommendations: 3 specific, actionable steps to improve or maintain performance.
    - projectedGPA: A realistic GPA projection for the current semester.
    - attendanceWarning: If attendance is below 75%, provide a warning about condonation.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskLevel: { type: Type.STRING },
            prediction: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            projectedGPA: { type: Type.NUMBER },
            attendanceWarning: { type: Type.STRING }
          },
          required: ["riskLevel", "prediction", "recommendations", "projectedGPA"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error fetching predictive insights:", error);
    return {
      riskLevel: 'Moderate',
      prediction: "Unable to generate real-time prediction. Please check your manual indicators.",
      recommendations: ["Maintain attendance above 75%", "Focus on internal exams", "Clear backlogs early"],
      projectedGPA: studentData.previousGPA || 7.0
    };
  }
};

export const getSubjectRecoveryAdvice = async (subjectData: any): Promise<SubjectRecoveryAdvice> => {
  const prompt = `
    Analyze the following internal marks split-up for a subject and provide a recovery strategy.
    Subject: ${JSON.stringify(subjectData)}
    
    Context:
    - Passing threshold for internals is 23/50.
    - Components: Series 1 (15), Series 2 (15), Assignments (10), Attendance (10).
    
    Provide a JSON response with:
    - strategy: A 1-sentence high-level strategy.
    - priority: 'Low', 'Medium', 'High', or 'Critical' based on how far they are from 23.
    - steps: 3 specific steps to reach the 23-mark threshold.
    - estimatedPassProbability: A percentage (0-100) of passing internals if they follow the steps.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            strategy: { type: Type.STRING },
            priority: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            estimatedPassProbability: { type: Type.NUMBER }
          },
          required: ["strategy", "priority", "steps", "estimatedPassProbability"]
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error fetching subject recovery advice:", error);
    return {
      strategy: "Focus on maximizing Series 2 and Assignments.",
      priority: 'Medium',
      steps: ["Score 12+ in Series 2", "Submit all assignments on time", "Maintain full attendance"],
      estimatedPassProbability: 75
    };
  }
};
