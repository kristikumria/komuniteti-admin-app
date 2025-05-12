import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Card, Button, RadioButton, Checkbox, TextInput, Divider, Chip, useTheme, ActivityIndicator } from 'react-native-paper';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { 
  fetchPollRequest, 
  fetchPollSuccess, 
  fetchPollFailure,
  fetchPollSummaryRequest,
  fetchPollSummarySuccess,
  fetchPollSummaryFailure,
  submitPollResponseRequest,
  submitPollResponseSuccess,
  submitPollResponseFailure
} from '../../../store/slices/pollsSlice';
import { pollService } from '../../../services/pollService';
import { format } from 'date-fns';
import { Poll, PollQuestion, PollAnswer } from '../../../navigation/types';

type Props = {
  navigation: any;
  route: any;
};

export const PollDetailsScreen = ({ navigation, route }: Props) => {
  const { pollId } = route.params;
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const { activePoll, pollSummary, loading, submitting, error } = useAppSelector(state => state.polls);
  const { user } = useAppSelector(state => state.auth);
  
  // Store answers as the user completes the form
  const [answers, setAnswers] = useState<PollAnswer[]>([]);
  // Track whether to show results or the poll form
  const [showResults, setShowResults] = useState(false);
  
  useEffect(() => {
    const loadPoll = async () => {
      dispatch(fetchPollRequest());
      try {
        const data = await pollService.getPollById(pollId);
        dispatch(fetchPollSuccess(data));
        
        // If poll is expired or closed, automatically show results
        if (data.status === 'expired' || data.status === 'closed') {
          loadPollSummary();
          setShowResults(true);
        }
      } catch (err) {
        dispatch(fetchPollFailure(err instanceof Error ? err.message : 'Failed to load poll'));
      }
    };
    
    loadPoll();
  }, [dispatch, pollId]);
  
  const loadPollSummary = async () => {
    dispatch(fetchPollSummaryRequest());
    try {
      const data = await pollService.getPollSummary(pollId);
      dispatch(fetchPollSummarySuccess(data));
    } catch (err) {
      dispatch(fetchPollSummaryFailure(err instanceof Error ? err.message : 'Failed to load poll summary'));
    }
  };
  
  const handleAnswerChange = (questionId: string, answer: string | string[] | number) => {
    // Find if there's an existing answer for this question
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
      // Update existing answer
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = { questionId, answer };
      setAnswers(newAnswers);
    } else {
      // Add new answer
      setAnswers([...answers, { questionId, answer }]);
    }
  };
  
  const handleMultiChoiceChange = (questionId: string, option: string, isSelected: boolean) => {
    // Find existing answer
    const existingAnswerIndex = answers.findIndex(a => a.questionId === questionId);
    
    if (existingAnswerIndex !== -1) {
      const currentAnswer = answers[existingAnswerIndex].answer as string[];
      let newAnswer: string[];
      
      if (isSelected) {
        // Add option to selected options
        newAnswer = Array.isArray(currentAnswer) ? [...currentAnswer, option] : [option];
      } else {
        // Remove option from selected options
        newAnswer = Array.isArray(currentAnswer) 
          ? currentAnswer.filter(o => o !== option) 
          : [];
      }
      
      const newAnswers = [...answers];
      newAnswers[existingAnswerIndex] = { questionId, answer: newAnswer };
      setAnswers(newAnswers);
    } else if (isSelected) {
      // Create new answer with just this option
      setAnswers([...answers, { questionId, answer: [option] }]);
    }
  };
  
  const isOptionSelected = (questionId: string, option: string): boolean => {
    const answer = answers.find(a => a.questionId === questionId);
    if (!answer) return false;
    
    const answerValue = answer.answer;
    return Array.isArray(answerValue) 
      ? answerValue.includes(option)
      : answerValue === option;
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    // Check required questions
    const requiredQuestions = activePoll?.questions.filter(q => q.required) || [];
    const answeredRequiredQuestions = requiredQuestions.filter(q => 
      answers.some(a => a.questionId === q.id)
    );
    
    if (answeredRequiredQuestions.length < requiredQuestions.length) {
      // TODO: Show validation error for unanswered questions
      return;
    }
    
    dispatch(submitPollResponseRequest());
    try {
      await pollService.submitPollResponse(pollId, user.id, user.name, answers);
      dispatch(submitPollResponseSuccess({
        id: `resp-${Date.now()}`,
        pollId,
        userId: user.id,
        userName: user.name,
        createdAt: new Date().toISOString(),
        answers,
      }));
      
      // After submitting, load the results and show them
      await loadPollSummary();
      setShowResults(true);
    } catch (err) {
      dispatch(submitPollResponseFailure(err instanceof Error ? err.message : 'Failed to submit response'));
    }
  };
  
  const renderQuestion = (question: PollQuestion) => {
    switch (question.type) {
      case 'single_choice':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text} {question.required && <Text style={styles.requiredStar}>*</Text>}</Text>
            <RadioButton.Group 
              onValueChange={value => handleAnswerChange(question.id, value)} 
              value={answers.find(a => a.questionId === question.id)?.answer as string || ''}
            >
              {question.options?.map(option => (
                <View key={option} style={styles.radioOption}>
                  <RadioButton value={option} />
                  <Text>{option}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>
        );
      
      case 'multiple_choice':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text} {question.required && <Text style={styles.requiredStar}>*</Text>}</Text>
            {question.options?.map(option => (
              <View key={option} style={styles.checkboxOption}>
                <Checkbox
                  status={isOptionSelected(question.id, option) ? 'checked' : 'unchecked'}
                  onPress={() => handleMultiChoiceChange(
                    question.id, 
                    option, 
                    !isOptionSelected(question.id, option)
                  )}
                />
                <Text>{option}</Text>
              </View>
            ))}
          </View>
        );
      
      case 'rating':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text} {question.required && <Text style={styles.requiredStar}>*</Text>}</Text>
            <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map(rating => (
                <Button 
                  key={rating}
                  mode={answers.find(a => a.questionId === question.id)?.answer === rating ? 'contained' : 'outlined'}
                  onPress={() => handleAnswerChange(question.id, rating)}
                  style={styles.ratingButton}
                >
                  {rating.toString()}
                </Button>
              ))}
            </View>
          </View>
        );
      
      case 'text':
        return (
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>{question.text} {question.required && <Text style={styles.requiredStar}>*</Text>}</Text>
            <TextInput
              mode="outlined"
              multiline
              numberOfLines={3}
              value={answers.find(a => a.questionId === question.id)?.answer as string || ''}
              onChangeText={text => handleAnswerChange(question.id, text)}
              style={styles.textInput}
            />
          </View>
        );
      
      default:
        return null;
    }
  };
  
  const renderResults = () => {
    if (!pollSummary) return null;
    
    return (
      <View style={styles.resultsContainer}>
        <Text variant="titleLarge" style={styles.sectionTitle}>Poll Results</Text>
        <Text style={styles.totalResponses}>Total Responses: {pollSummary.totalResponses}</Text>
        
        {pollSummary.questionSummaries.map(questionSummary => (
          <Card key={questionSummary.questionId} style={styles.resultCard}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.questionText}>{questionSummary.questionText}</Text>
              
              {questionSummary.type === 'rating' && (
                <Text style={styles.averageRating}>
                  Average Rating: {(questionSummary.answers.reduce((acc, answer) => acc + (Number(answer.option || 0) * answer.count), 0) / questionSummary.answers.reduce((acc, answer) => acc + answer.count, 0)).toFixed(1)} / 5
                </Text>
              )}
              
              {questionSummary.type !== 'text' && questionSummary.answers.map(answer => (
                <View key={answer.option} style={styles.resultItem}>
                  <View style={styles.resultRow}>
                    <Text style={styles.optionText}>{answer.option}</Text>
                    <Text style={styles.percentageText}>{answer.percentage.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${answer.percentage}%`, backgroundColor: theme.colors.primary }
                      ]} 
                    />
                  </View>
                  <Text style={styles.countText}>{answer.count} responses</Text>
                </View>
              ))}
              
              {questionSummary.type === 'text' && questionSummary.answers[0]?.textAnswers && (
                <View style={styles.textAnswersContainer}>
                  {questionSummary.answers[0].textAnswers.map((text, index) => (
                    <View key={index} style={styles.textAnswerItem}>
                      <Text>"{text}"</Text>
                      <Divider style={styles.textDivider} />
                    </View>
                  ))}
                </View>
              )}
            </Card.Content>
          </Card>
        ))}
      </View>
    );
  };
  
  if (loading && !activePoll) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  if (error && !activePoll) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }
  
  if (!activePoll) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text>Poll not found</Text>
      </View>
    );
  }
  
  const isPollActive = activePoll.status === 'active';
  const expiryDate = new Date(activePoll.expiresAt);
  const isExpired = expiryDate < new Date();
  
  const statusColor = isPollActive 
    ? theme.colors.primary 
    : (isExpired ? theme.colors.error : theme.colors.secondary);
  
  const statusText = isPollActive 
    ? 'Active' 
    : (isExpired ? 'Expired' : 'Closed');
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>{activePoll.title}</Text>
        <Chip 
          style={{ backgroundColor: statusColor }} 
          textStyle={{ color: 'white' }}
        >
          {statusText}
        </Chip>
      </View>
      
      <Text style={styles.description}>{activePoll.description}</Text>
      
      <View style={styles.metaInfo}>
        <Text style={styles.metaText}>Created: {format(new Date(activePoll.createdAt), 'MMM d, yyyy')}</Text>
        {isPollActive && (
          <Text style={styles.metaText}>Expires: {format(expiryDate, 'MMM d, yyyy')}</Text>
        )}
        <Text style={styles.metaText}>Responses: {activePoll.responseCount}</Text>
        {activePoll.isAnonymous && (
          <Text style={styles.anonymousText}>Responses to this poll are anonymous</Text>
        )}
      </View>
      
      <Divider style={styles.divider} />
      
      {showResults ? (
        // Show the results view
        renderResults()
      ) : (
        // Show the poll form
        <>
          {isPollActive ? (
            <>
              <Text variant="titleLarge" style={styles.sectionTitle}>Questions</Text>
              <Text style={styles.requiredText}>* Required questions</Text>
              
              {activePoll.questions.map(question => (
                <React.Fragment key={question.id}>
                  {renderQuestion(question)}
                  <Divider style={styles.questionDivider} />
                </React.Fragment>
              ))}
              
              <View style={styles.actions}>
                <Button 
                  mode="contained" 
                  onPress={handleSubmit}
                  loading={submitting}
                  disabled={submitting}
                  style={styles.submitButton}
                >
                  Submit Response
                </Button>
                
                <Button 
                  mode="outlined" 
                  onPress={() => {
                    loadPollSummary();
                    setShowResults(true);
                  }}
                  style={styles.viewResultsButton}
                >
                  View Results
                </Button>
              </View>
            </>
          ) : (
            <View style={styles.inactive}>
              <Text style={styles.inactiveText}>
                This poll is no longer active. You can view the results below.
              </Text>
              <Button 
                mode="contained" 
                onPress={() => {
                  loadPollSummary();
                  setShowResults(true);
                }}
                style={styles.viewResultsButton}
              >
                View Results
              </Button>
            </View>
          )}
        </>
      )}
      
      {showResults && (
        <Button 
          mode="outlined" 
          onPress={() => setShowResults(false)}
          style={styles.backToFormButton}
        >
          Back to Poll
        </Button>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    flex: 1,
    marginRight: 8,
  },
  description: {
    paddingHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  metaInfo: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  anonymousText: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 4,
  },
  divider: {
    marginBottom: 16,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  requiredText: {
    paddingHorizontal: 16,
    marginBottom: 16,
    fontStyle: 'italic',
    fontSize: 14,
    color: '#666',
  },
  requiredStar: {
    color: 'red',
  },
  questionContainer: {
    padding: 16,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingButton: {
    marginHorizontal: 4,
  },
  textInput: {
    marginTop: 8,
  },
  questionDivider: {
    marginVertical: 8,
  },
  actions: {
    padding: 16,
    marginBottom: 32,
  },
  submitButton: {
    marginBottom: 12,
  },
  viewResultsButton: {
    marginBottom: 16,
  },
  backToFormButton: {
    margin: 16,
  },
  inactive: {
    padding: 16,
    alignItems: 'center',
  },
  inactiveText: {
    textAlign: 'center',
    marginBottom: 16,
  },
  resultsContainer: {
    padding: 16,
  },
  totalResponses: {
    fontSize: 16,
    marginBottom: 16,
  },
  resultCard: {
    marginBottom: 16,
  },
  resultItem: {
    marginVertical: 8,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  optionText: {
    flex: 1,
  },
  percentageText: {
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 6,
  },
  countText: {
    fontSize: 12,
    color: '#666',
  },
  averageRating: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  textAnswersContainer: {
    marginTop: 8,
  },
  textAnswerItem: {
    marginBottom: 12,
  },
  textDivider: {
    marginTop: 8,
  },
  errorText: {
    color: 'red',
  },
}); 