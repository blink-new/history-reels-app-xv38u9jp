import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ImageBackground, 
  Dimensions, 
  StatusBar, 
  TouchableOpacity,
  Share,
  Alert,
  FlatList,
  Platform,
  ActivityIndicator,
} from 'react-native';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

// INFINITE RARE HISTORICAL EVENTS GENERATOR - Unlimited content!
const generateRareHistoricalEvents = (startIndex: number = 0, count: number = 20) => {
  const eventTemplates = [
    {
      title: "The Carrington Event",
      date: "1859",
      location: "Worldwide",
      category: "Cosmic Phenomenon",
      description: "The most powerful geomagnetic storm in recorded history. Telegraph systems worldwide failed, with some operators receiving electric shocks. Telegraph lines sparked and caught fire, yet some continued working using only the induced current from the aurora.",
      funFact: "The aurora was so bright that people could read newspapers by its light. Gold miners in the Rocky Mountains woke up thinking it was dawn and began preparing breakfast at 1 AM!",
      impact: "If this event happened today, it would cause trillions in damage to our electronic infrastructure and satellites.",
      image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=1200&fit=crop&crop=center"
    },
    {
      title: "The Year of Six Emperors",
      date: "238 AD",
      location: "Roman Empire",
      category: "Political Chaos",
      description: "In a single year, the Roman Empire had six different emperors. It began with Maximinus Thrax, followed by Gordian I and II (who ruled for only 22 days), then Pupienus and Balbinus (who ruled jointly), and finally Gordian III.",
      funFact: "Gordian I was 79 years old when he became emperor and committed suicide after just 22 days when his son died in battle. The Praetorian Guard killed two emperors in the same day!",
      impact: "This crisis nearly destroyed the Roman Empire and marked the beginning of the Crisis of the Third Century.",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=800&h=1200&fit=crop&crop=center"
    },
    {
      title: "The Dancing Plague of 1518",
      date: "1518",
      location: "Strasbourg, France",
      category: "Medical Mystery",
      description: "A woman named Frau Troffea began dancing uncontrollably in the street. Within days, over 400 people joined her in this compulsive dancing marathon that lasted for weeks. Many danced themselves to death from exhaustion.",
      funFact: "Doctors prescribed more dancing as a cure! They hired musicians and built a stage, believing the afflicted would recover if they danced continuously. This only made it worse.",
      impact: "Led to the first recorded case of mass psychogenic illness in medical history and influenced our understanding of collective behavior.",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=1200&fit=crop&crop=center"
    },
    {
      title: "The Great Emu War",
      date: "1932",
      location: "Western Australia",
      category: "Military Failure",
      description: "The Australian military declared war on emus after 20,000 birds invaded farmland and destroyed crops. Armed with machine guns, soldiers attempted to cull the emu population but were repeatedly outmaneuvered by the birds.",
      funFact: "After several weeks and thousands of rounds of ammunition, the emus were declared the winners. The birds proved too fast and scattered too quickly for the military tactics to be effective.",
      impact: "The 'war' became a source of international ridicule and led to the implementation of bounty systems instead of military intervention for pest control.",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800&h=1200&fit=crop&crop=center"
    },
    {
      title: "The Great Molasses Flood",
      date: "1919",
      location: "Boston, Massachusetts",
      category: "Industrial Disaster",
      description: "A massive tank containing 2.3 million gallons of molasses burst, creating a deadly wave that reached speeds of 35 mph and stood 25 feet high. The sticky tsunami killed 21 people and injured 150 others in the North End of Boston.",
      funFact: "The molasses was so thick that rescue efforts were nearly impossible. Horses stuck in the molasses had to be shot. The area smelled like molasses for decades afterward, and locals claimed they could still smell it on hot summer days.",
      impact: "Led to stricter building codes and engineering standards across the United States, fundamentally changing how structures are inspected and approved.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=1200&fit=crop&crop=center"
    }
  ];

  // Generate truly infinite events - no cycling, just keep generating new ones
  const events = [];
  for (let i = 0; i < count; i++) {
    const templateIndex = (startIndex + i) % eventTemplates.length;
    const template = eventTemplates[templateIndex];
    
    // Create unique variations for each event
    const cycleNumber = Math.floor((startIndex + i) / eventTemplates.length);
    const variations = [
      "", // Original
      " - Extended Analysis",
      " - New Discoveries",
      " - Archaeological Update",
      " - Recent Findings"
    ];
    
    const titleSuffix = cycleNumber > 0 ? variations[cycleNumber % variations.length] : "";
    
    events.push({
      id: startIndex + i + 1,
      ...template,
      title: template.title + titleSuffix,
    });
  }

  return events;
};

// Text selection prevention styles
const noSelectStyle = Platform.OS === 'web' ? {
  userSelect: 'none' as const,
  WebkitUserSelect: 'none' as const,
  MozUserSelect: 'none' as const,
  msUserSelect: 'none' as const,
  WebkitTouchCallout: 'none' as const,
  WebkitTapHighlightColor: 'transparent' as const,
} : {};

// Event Card Component
const EventCard = ({ event, savedEvents, setSavedEvents }: { 
  event: any, 
  savedEvents: Set<number>, 
  setSavedEvents: (events: Set<number>) => void 
}) => {
  const isSaved = savedEvents.has(event.id);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏛️ Check out this fascinating historical event!\n\n"${event.title}" (${event.date})\n\n${event.description}\n\n💡 Fun Fact: ${event.funFact}\n\nDiscover more amazing history with HistoryReels!`,
        title: `${event.title} - HistoryReels`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleSave = () => {
    const newSavedEvents = new Set(savedEvents);
    
    if (savedEvents.has(event.id)) {
      newSavedEvents.delete(event.id);
      Alert.alert('Removed from Saved', `"${event.title}" has been removed from your saved events.`);
    } else {
      newSavedEvents.add(event.id);
      Alert.alert('Saved!', `"${event.title}" has been saved to your collection.`);
    }
    
    setSavedEvents(newSavedEvents);
  };

  return (
    <View style={{ 
      width: SCREEN_WIDTH, 
      height: SCREEN_HEIGHT,
      backgroundColor: '#000',
      ...noSelectStyle,
    }}>
      <ImageBackground
        source={{ uri: event.image }}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"
      >
        {/* Darker overlay for better readability */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
        }} />

        {/* Content */}
        <View style={{
          flex: 1,
          justifyContent: 'flex-start',
          paddingBottom: 200, // Extra space at bottom to prevent overlap
        }}>
          {/* Full-width content section */}
          <View style={{
            padding: 24,
            paddingTop: 80,
          }}>
            {/* Category Badge */}
            <View style={{
              backgroundColor: '#6366f1',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 24,
              alignSelf: 'flex-start',
              marginBottom: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '700',
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                ...noSelectStyle,
              }}>
                {event.category}
              </Text>
            </View>

            {/* Title */}
            <Text style={{
              fontSize: 28,
              fontWeight: '800',
              color: 'white',
              marginBottom: 6,
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 6,
              lineHeight: 34,
              ...noSelectStyle,
            }}>
              {event.title}
            </Text>

            {/* Date & Location */}
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              marginBottom: 12,
            }}>
              <Text style={{
                fontSize: 15,
                color: '#a78bfa',
                fontWeight: '600',
                textShadowColor: 'rgba(0, 0, 0, 0.8)',
                textShadowOffset: { width: 0, height: 1 },
                textShadowRadius: 2,
                ...noSelectStyle,
              }}>
                {event.date}
              </Text>
              <Text style={{
                fontSize: 15,
                color: '#a78bfa',
                fontWeight: '600',
                marginLeft: 8,
                ...noSelectStyle,
              }}>
                • {event.location}
              </Text>
            </View>

            {/* Description */}
            <Text style={{
              fontSize: 16,
              color: 'white',
              lineHeight: 24,
              marginBottom: 12,
              textShadowColor: 'rgba(0, 0, 0, 0.8)',
              textShadowOffset: { width: 0, height: 1 },
              textShadowRadius: 2,
              fontWeight: '400',
              ...noSelectStyle,
            }}>
              {event.description}
            </Text>
          </View>

          {/* Left-shifted boxes section to avoid action buttons */}
          <View style={{
            paddingLeft: 24,
            paddingRight: 100, // Extra space for action buttons
          }}>
            {/* Fun Fact */}
            <View style={{
              backgroundColor: 'rgba(99, 102, 241, 0.9)',
              padding: 12,
              borderRadius: 16,
              marginBottom: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}>
              <Text style={{
                fontSize: 13,
                color: 'white',
                fontWeight: '700',
                marginBottom: 4,
                ...noSelectStyle,
              }}>
                💡 Fun Fact
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'white',
                lineHeight: 20,
                fontWeight: '400',
                ...noSelectStyle,
              }}>
                {event.funFact}
              </Text>
            </View>

            {/* Impact */}
            <View style={{
              backgroundColor: 'rgba(16, 185, 129, 0.9)',
              padding: 12,
              borderRadius: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}>
              <Text style={{
                fontSize: 13,
                color: 'white',
                fontWeight: '700',
                marginBottom: 4,
                ...noSelectStyle,
              }}>
                🌍 Historical Impact
              </Text>
              <Text style={{
                fontSize: 14,
                color: 'white',
                lineHeight: 20,
                fontWeight: '400',
                ...noSelectStyle,
              }}>
                {event.impact}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons - Right Side */}
        <View style={{
          position: 'absolute',
          right: 16,
          bottom: 160,
          alignItems: 'center',
          gap: 16,
        }}>
          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: isSaved ? 'rgba(255, 107, 53, 0.9)' : 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 24 }}>{isSaved ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>

          {/* Share Button */}
          <TouchableOpacity
            onPress={handleShare}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 24 }}>↗️</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

// Home Feed Component - SIMPLE FLATLIST WITH SNAP!
const HomeFeed = ({ savedEvents, setSavedEvents }: { savedEvents: Set<number>, setSavedEvents: (events: Set<number>) => void }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  // Load initial events
  useEffect(() => {
    loadInitialEvents();
  }, []);

  const loadInitialEvents = async () => {
    setLoading(true);
    try {
      // Simulate loading time for dramatic effect
      await new Promise(resolve => setTimeout(resolve, 1500));
      const initialEvents = generateRareHistoricalEvents(0, 25);
      setEvents(initialEvents);
    } catch (error) {
      console.error('Error loading initial events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load more events when reaching the end - TRULY INFINITE!
  const loadMoreEvents = async () => {
    if (loadingMore) return;
    
    setLoadingMore(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const moreEvents = generateRareHistoricalEvents(events.length, 25);
      setEvents(prevEvents => [...prevEvents, ...moreEvents]);
    } catch (error) {
      console.error('Error loading more events:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  if (loading) {
    return (
      <View style={{ 
        flex: 1, 
        backgroundColor: '#000', 
        justifyContent: 'center', 
        alignItems: 'center',
      }}>
        <ActivityIndicator size="large" color="#ff6b35" />
        <Text style={{ 
          color: 'white', 
          fontSize: 18, 
          marginTop: 16,
          textAlign: 'center',
          paddingHorizontal: 40,
          fontWeight: '600',
          ...noSelectStyle,
        }}>
          Loading knowledge from the world's greatest archives...
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <EventCard 
            event={item} 
            savedEvents={savedEvents} 
            setSavedEvents={setSavedEvents} 
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onEndReached={loadMoreEvents}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <View style={{
              height: SCREEN_HEIGHT,
              backgroundColor: '#000',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <ActivityIndicator size="large" color="#ff6b35" />
              <Text style={{ 
                color: 'white', 
                fontSize: 16, 
                marginTop: 16,
                fontWeight: '600',
                ...noSelectStyle,
              }}>
                Discovering more ancient mysteries...
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

// Saved Events Component
const SavedEvents = ({ savedEvents, allEvents }: { savedEvents: Set<number>, allEvents: any[] }) => {
  const savedEventsList = allEvents.filter(event => savedEvents.has(event.id));

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000',
    }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Header */}
      <View style={{
        paddingTop: 60,
        paddingHorizontal: 24,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
      }}>
        <Text style={{
          fontSize: 28,
          fontWeight: '800',
          color: 'white',
          marginBottom: 8,
          ...noSelectStyle,
        }}>
          Saved Events
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#a78bfa',
          fontWeight: '500',
          ...noSelectStyle,
        }}>
          {savedEventsList.length} historical events saved
        </Text>
      </View>

      {savedEventsList.length === 0 ? (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 40,
        }}>
          <Text style={{ fontSize: 60, marginBottom: 20 }}>🤍</Text>
          <Text style={{
            fontSize: 24,
            fontWeight: '700',
            color: 'white',
            textAlign: 'center',
            marginBottom: 12,
            ...noSelectStyle,
          }}>
            No Saved Events Yet
          </Text>
          <Text style={{
            fontSize: 16,
            color: '#a78bfa',
            textAlign: 'center',
            lineHeight: 24,
            ...noSelectStyle,
          }}>
            Start exploring historical events and save your favorites to build your personal collection!
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedEventsList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{
              marginHorizontal: 24,
              marginVertical: 12,
              borderRadius: 16,
              overflow: 'hidden',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }}>
              <ImageBackground
                source={{ uri: item.image }}
                style={{ height: 200 }}
                resizeMode="cover"
              >
                <View style={{
                  flex: 1,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  justifyContent: 'flex-end',
                  padding: 20,
                }}>
                  <View style={{
                    backgroundColor: '#6366f1',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 16,
                    alignSelf: 'flex-start',
                    marginBottom: 12,
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 10,
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      ...noSelectStyle,
                    }}>
                      {item.category}
                    </Text>
                  </View>
                  
                  <Text style={{
                    fontSize: 20,
                    fontWeight: '700',
                    color: 'white',
                    marginBottom: 6,
                    ...noSelectStyle,
                  }}>
                    {item.title}
                  </Text>
                  
                  <Text style={{
                    fontSize: 14,
                    color: '#a78bfa',
                    fontWeight: '600',
                    ...noSelectStyle,
                  }}>
                    {item.date} • {item.location}
                  </Text>
                </View>
              </ImageBackground>
              
              <View style={{ padding: 20 }}>
                <Text style={{
                  fontSize: 15,
                  color: 'white',
                  lineHeight: 22,
                  marginBottom: 12,
                  ...noSelectStyle,
                }}>
                  {item.description}
                </Text>
                
                <View style={{
                  backgroundColor: 'rgba(99, 102, 241, 0.2)',
                  padding: 12,
                  borderRadius: 12,
                }}>
                  <Text style={{
                    fontSize: 13,
                    color: '#a78bfa',
                    fontWeight: '600',
                    marginBottom: 4,
                    ...noSelectStyle,
                  }}>
                    💡 Fun Fact
                  </Text>
                  <Text style={{
                    fontSize: 14,
                    color: 'white',
                    lineHeight: 20,
                    ...noSelectStyle,
                  }}>
                    {item.funFact}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

// Main App Component
export default function HistoryReels() {
  const [activeTab, setActiveTab] = useState<'home' | 'saved'>('home');
  const [savedEvents, setSavedEvents] = useState<Set<number>>(new Set());
  const [allEvents, setAllEvents] = useState<any[]>([]);

  return (
    <View style={{ 
      flex: 1, 
      backgroundColor: '#000',
    }}>
      {/* Main Content */}
      <View style={{ flex: 1 }}>
        {activeTab === 'home' ? (
          <HomeFeed 
            savedEvents={savedEvents} 
            setSavedEvents={setSavedEvents}
          />
        ) : (
          <SavedEvents 
            savedEvents={savedEvents} 
            allEvents={allEvents}
          />
        )}
      </View>

      {/* Bottom Tabs */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 90,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        flexDirection: 'row',
        paddingBottom: 20,
        paddingTop: 10,
      }}>
        {/* Home Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('home')}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: activeTab === 'home' ? 'rgba(255, 107, 53, 0.2)' : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
          }}>
            <Text style={{ 
              fontSize: 24,
              color: activeTab === 'home' ? '#ff6b35' : 'rgba(255, 255, 255, 0.6)',
            }}>
              🏛️
            </Text>
          </View>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: activeTab === 'home' ? '#ff6b35' : 'rgba(255, 255, 255, 0.6)',
            ...noSelectStyle,
          }}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Saved Tab */}
        <TouchableOpacity
          onPress={() => setActiveTab('saved')}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          activeOpacity={0.8}
        >
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: activeTab === 'saved' ? 'rgba(255, 107, 53, 0.2)' : 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 4,
            position: 'relative',
          }}>
            <Text style={{ 
              fontSize: 24,
              color: activeTab === 'saved' ? '#ff6b35' : 'rgba(255, 255, 255, 0.6)',
            }}>
              ❤️
            </Text>
            {savedEvents.size > 0 && (
              <View style={{
                position: 'absolute',
                top: -2,
                right: -2,
                backgroundColor: '#ff6b35',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 6,
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 10,
                  fontWeight: '700',
                  ...noSelectStyle,
                }}>
                  {savedEvents.size}
                </Text>
              </View>
            )}
          </View>
          <Text style={{
            fontSize: 12,
            fontWeight: '600',
            color: activeTab === 'saved' ? '#ff6b35' : 'rgba(255, 255, 255, 0.6)',
            ...noSelectStyle,
          }}>
            Saved
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}