// Simple placeholder component for user location input/search.
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ActivityIndicator, Keyboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function LocationSearch({ onLocationSelect }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = 'a693943efa754abb860163744241803';

  const searchLocations = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Failed to fetch suggestions:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (location) => {
    Keyboard.dismiss();
    setQuery(location.name);
    setSuggestions([]);
    onLocationSelect(location);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter city or zip code..."
          placeholderTextColor="rgba(255,255,255,0.5)"
          value={query}
          adjustsFontSizeToFit={true}
          numberOfLines={1}
          minimumFontSize={12}
          onChangeText={(text) => {
            setQuery(text);
            searchLocations(text);
          }}
        />
        {isLoading && (
          <ActivityIndicator style={styles.loader} color="#fff" />
        )}
      </View>

      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((location) => (
            <TouchableOpacity
              key={`${location.lat}-${location.lon}`}
              style={styles.suggestionItem}
              onPress={() => handleLocationSelect(location)}
            >
              <Text 
                style={styles.suggestionText}
                adjustsFontSizeToFit={true}
                numberOfLines={1}
                minimumFontSize={12}
              >
                {location.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(178, 0, 204, 0.5)', 
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    fontFamily: 'Urbanist',
    fontSize: 16,
    maxWidth: '100%',
  },
  loader: {
    marginLeft: 10,
  },
  suggestionsContainer: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  suggestionText: {
    color: '#fff',
    fontFamily: 'Urbanist',
    fontSize: 14,
    maxWidth: '100%',
  },
}); 