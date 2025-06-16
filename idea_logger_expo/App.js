import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [filter, setFilter] = useState('');
  const [ideas, setIdeas] = useState([]);

  useEffect(() => {
    loadIdeas();
  }, []);

  const loadIdeas = async () => {
    try {
      const data = await AsyncStorage.getItem('ideas');
      if (data) {
        setIdeas(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load ideas', e);
    }
  };

  const saveIdeas = async (newIdeas) => {
    try {
      await AsyncStorage.setItem('ideas', JSON.stringify(newIdeas));
    } catch (e) {
      console.error('Failed to save ideas', e);
    }
  };

  const addIdea = () => {
    if (!title && !content) return;
    const newIdea = {
      title,
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    const newIdeas = [...ideas, newIdea];
    setIdeas(newIdeas);
    saveIdeas(newIdeas);
    setTitle('');
    setContent('');
    setTags('');
  };

  const removeIdea = (index) => {
    const newIdeas = ideas.filter((_, i) => i !== index);
    setIdeas(newIdeas);
    saveIdeas(newIdeas);
  };

  const filteredIdeas = ideas.filter(idea => {
    if (!filter) return true;
    return idea.tags.some(tag => tag.toLowerCase().includes(filter.toLowerCase()));
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Idea Logger</Text>
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Your idea..."
          value={content}
          onChangeText={setContent}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Tags (comma separated)"
          value={tags}
          onChangeText={setTags}
        />
        <Button title="Save Idea" onPress={addIdea} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Filter by tag"
        value={filter}
        onChangeText={setFilter}
      />

      <FlatList
        data={filteredIdeas}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.ideaItem}>
            <View style={{flex:1}}>
              <Text style={styles.ideaTitle}>{item.title}</Text>
              <Text>{item.content}</Text>
              <Text style={styles.tags}>{item.tags.join(', ')}</Text>
            </View>
            <TouchableOpacity onPress={() => removeIdea(index)} style={styles.deleteButton}>
              <Text style={{color:'#fff'}}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7'
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  inputArea: {
    marginBottom: 20
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 10,
    borderRadius: 4,
    backgroundColor: '#fff'
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top'
  },
  ideaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  ideaTitle: {
    fontWeight: 'bold'
  },
  tags: {
    fontStyle: 'italic',
    color: '#555'
  },
  deleteButton: {
    marginLeft: 10,
    padding: 8,
    backgroundColor: '#007bff',
    borderRadius: 4
  }
});
