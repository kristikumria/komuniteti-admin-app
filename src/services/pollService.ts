import axios from 'axios';
import { 
  Poll, 
  PollResponse, 
  PollSummary, 
  PollQuestion 
} from '../navigation/types';

// API config (to be replaced with actual API endpoint)
const API_URL = process.env.API_URL || 'https://api.komuniteti.com';

// Mock data for development until API is ready
const MOCK_POLLS: Poll[] = [
  {
    id: 'poll1',
    title: 'Building Maintenance Satisfaction',
    description: 'Please rate your satisfaction with the building maintenance services.',
    createdBy: 'admin1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days from now
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        text: 'How would you rate the overall cleanliness of common areas?',
        required: true,
      },
      {
        id: 'q2',
        type: 'rating',
        text: 'How satisfied are you with the response time for maintenance requests?',
        required: true,
      },
      {
        id: 'q3',
        type: 'single_choice',
        text: 'Which area needs the most improvement?',
        options: ['Cleaning', 'Repairs', 'Security', 'Communication'],
        required: true,
      },
      {
        id: 'q4',
        type: 'text',
        text: 'Any additional comments or suggestions?',
        required: false,
      },
    ],
    targetAudience: {
      all: true,
    },
    responseCount: 15,
    isAnonymous: false,
  },
  {
    id: 'poll2',
    title: 'Community Event Preferences',
    description: 'Help us plan the upcoming community events by sharing your preferences.',
    createdBy: 'admin1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days from now
    status: 'active',
    questions: [
      {
        id: 'q1',
        type: 'multiple_choice',
        text: 'Which types of events would you be interested in attending?',
        options: ['BBQ Party', 'Game Night', 'Fitness Classes', 'Movie Night', 'Educational Workshops'],
        required: true,
      },
      {
        id: 'q2',
        type: 'single_choice',
        text: 'What day of the week works best for community events?',
        options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true,
      },
      {
        id: 'q3',
        type: 'single_choice',
        text: 'What time of day is most convenient for you?',
        options: ['Morning', 'Afternoon', 'Evening'],
        required: true,
      },
    ],
    targetAudience: {
      all: true,
    },
    responseCount: 8,
    isAnonymous: true,
  },
  {
    id: 'poll3',
    title: 'Building Security Assessment',
    description: 'Please share your feedback about the current security measures in your building.',
    createdBy: 'admin1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    status: 'expired',
    questions: [
      {
        id: 'q1',
        type: 'rating',
        text: 'How safe do you feel in the building?',
        required: true,
      },
      {
        id: 'q2',
        type: 'single_choice',
        text: 'Do you think additional security cameras are needed?',
        options: ['Yes', 'No', 'Not sure'],
        required: true,
      },
      {
        id: 'q3',
        type: 'text',
        text: 'Any security concerns you would like to report?',
        required: false,
      },
    ],
    targetAudience: {
      all: true,
    },
    responseCount: 22,
    isAnonymous: false,
  },
];

// Mock poll responses
const MOCK_RESPONSES: PollResponse[] = [
  {
    id: 'resp1',
    pollId: 'poll1',
    userId: 'user1',
    userName: 'John Smith',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
    answers: [
      { questionId: 'q1', answer: 4 },
      { questionId: 'q2', answer: 3 },
      { questionId: 'q3', answer: 'Repairs' },
      { questionId: 'q4', answer: 'Elevator maintenance could be improved.' },
    ],
  },
  {
    id: 'resp2',
    pollId: 'poll1',
    userId: 'user2',
    userName: 'Maria Garcia',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(), // 6 days ago
    answers: [
      { questionId: 'q1', answer: 5 },
      { questionId: 'q2', answer: 4 },
      { questionId: 'q3', answer: 'Communication' },
      { questionId: 'q4', answer: 'Overall satisfied with maintenance.' },
    ],
  },
];

// Generate mock poll summary
const generateMockPollSummary = (pollId: string): PollSummary => {
  const poll = MOCK_POLLS.find(p => p.id === pollId);
  const responses = MOCK_RESPONSES.filter(r => r.pollId === pollId);
  
  if (!poll) {
    throw new Error(`Poll with ID ${pollId} not found`);
  }
  
  return {
    pollId,
    totalResponses: responses.length,
    questionSummaries: poll.questions.map(question => {
      const answers = responses.map(r => r.answers.find(a => a.questionId === question.id));
      
      switch (question.type) {
        case 'single_choice':
        case 'multiple_choice': {
          const optionCounts = {};
          answers.forEach(answer => {
            if (!answer) return;
            
            const answerValue = Array.isArray(answer.answer) ? answer.answer : [answer.answer];
            answerValue.forEach(option => {
              optionCounts[option] = (optionCounts[option] || 0) + 1;
            });
          });
          
          return {
            questionId: question.id,
            questionText: question.text,
            type: question.type,
            answers: Object.keys(optionCounts).map(option => ({
              option,
              count: optionCounts[option],
              percentage: (optionCounts[option] / responses.length) * 100,
            })),
          };
        }
        
        case 'rating': {
          let sum = 0;
          let count = 0;
          const ratings = {};
          
          answers.forEach(answer => {
            if (!answer) return;
            const rating = answer.answer as number;
            sum += rating;
            count++;
            ratings[rating] = (ratings[rating] || 0) + 1;
          });
          
          return {
            questionId: question.id,
            questionText: question.text,
            type: question.type,
            answers: Object.keys(ratings).map(rating => ({
              option: rating,
              count: ratings[rating],
              percentage: (ratings[rating] / responses.length) * 100,
            })),
            averageRating: sum / count,
          };
        }
        
        case 'text': {
          const textAnswers = answers
            .filter(answer => answer && typeof answer.answer === 'string')
            .map(answer => answer!.answer as string);
          
          return {
            questionId: question.id,
            questionText: question.text,
            type: question.type,
            answers: [{
              count: textAnswers.length,
              percentage: (textAnswers.length / responses.length) * 100,
              textAnswers,
            }],
          };
        }
        
        default:
          return {
            questionId: question.id,
            questionText: question.text,
            type: question.type as any,
            answers: [],
          };
      }
    }),
  };
};

export const pollService = {
  // Get all polls
  getPolls: async (): Promise<Poll[]> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/polls`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([...MOCK_POLLS]);
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching polls:', error);
      throw error;
    }
  },
  
  // Get a specific poll by ID
  getPollById: async (pollId: string): Promise<Poll> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/polls/${pollId}`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const poll = MOCK_POLLS.find(p => p.id === pollId);
          if (poll) {
            resolve({...poll});
          } else {
            reject(new Error(`Poll with ID ${pollId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching poll:', error);
      throw error;
    }
  },
  
  // Create a new poll
  createPoll: async (pollData: Omit<Poll, 'id' | 'createdAt' | 'responseCount'>): Promise<Poll> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/polls`, pollData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve) => {
        setTimeout(() => {
          const newPoll: Poll = {
            ...pollData,
            id: `poll-${Date.now()}`,
            createdAt: new Date().toISOString(),
            responseCount: 0,
          };
          
          MOCK_POLLS.push(newPoll);
          resolve(newPoll);
        }, 500);
      });
    } catch (error) {
      console.error('Error creating poll:', error);
      throw error;
    }
  },
  
  // Update an existing poll
  updatePoll: async (pollId: string, pollData: Partial<Poll>): Promise<Poll> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.patch(`${API_URL}/polls/${pollId}`, pollData);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const pollIndex = MOCK_POLLS.findIndex(p => p.id === pollId);
          
          if (pollIndex !== -1) {
            const updatedPoll = {
              ...MOCK_POLLS[pollIndex],
              ...pollData,
            };
            
            MOCK_POLLS[pollIndex] = updatedPoll;
            resolve(updatedPoll);
          } else {
            reject(new Error(`Poll with ID ${pollId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error updating poll:', error);
      throw error;
    }
  },
  
  // Delete a poll
  deletePoll: async (pollId: string): Promise<void> => {
    try {
      // Uncomment when API is ready
      // await axios.delete(`${API_URL}/polls/${pollId}`);
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const pollIndex = MOCK_POLLS.findIndex(p => p.id === pollId);
          
          if (pollIndex !== -1) {
            MOCK_POLLS.splice(pollIndex, 1);
            resolve();
          } else {
            reject(new Error(`Poll with ID ${pollId} not found`));
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error deleting poll:', error);
      throw error;
    }
  },
  
  // Submit a response to a poll
  submitPollResponse: async (pollId: string, userId: string, userName: string, answers: PollAnswer[]): Promise<PollResponse> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.post(`${API_URL}/polls/${pollId}/responses`, { userId, userName, answers });
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          const poll = MOCK_POLLS.find(p => p.id === pollId);
          
          if (!poll) {
            reject(new Error(`Poll with ID ${pollId} not found`));
            return;
          }
          
          if (poll.status !== 'active') {
            reject(new Error(`Poll is not active`));
            return;
          }
          
          const newResponse: PollResponse = {
            id: `resp-${Date.now()}`,
            pollId,
            userId,
            userName,
            createdAt: new Date().toISOString(),
            answers,
          };
          
          MOCK_RESPONSES.push(newResponse);
          
          // Update response count
          const pollIndex = MOCK_POLLS.findIndex(p => p.id === pollId);
          if (pollIndex !== -1) {
            MOCK_POLLS[pollIndex].responseCount += 1;
          }
          
          resolve(newResponse);
        }, 500);
      });
    } catch (error) {
      console.error('Error submitting poll response:', error);
      throw error;
    }
  },
  
  // Get poll summary with response statistics
  getPollSummary: async (pollId: string): Promise<PollSummary> => {
    try {
      // Uncomment when API is ready
      // const response = await axios.get(`${API_URL}/polls/${pollId}/summary`);
      // return response.data;
      
      // Mock data for now
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          try {
            const summary = generateMockPollSummary(pollId);
            resolve(summary);
          } catch (error) {
            reject(error);
          }
        }, 500);
      });
    } catch (error) {
      console.error('Error fetching poll summary:', error);
      throw error;
    }
  },
}; 