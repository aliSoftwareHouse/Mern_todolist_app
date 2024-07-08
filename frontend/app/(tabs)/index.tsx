// index.js

import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import className from 'twrnc';
import axios from 'axios'; // Import Axios for HTTP requests

const index = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
  const [editKey, setEditKey] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const addTask = async () => {
    if (task.trim()) {
      try {
        if (editKey !== null) {
          await axios.put(`http://localhost:3000/api/tasks/${editKey}`, { value: task });
          setTasks(tasks.map((item) => (item.key === editKey ? { ...item, value: task } : item)));
          setEditKey(null);
        } else {
          const response = await axios.post('http://localhost:3000/api/tasks', {
            key: tasks.length.toString(),
            value: task,
          });
          setTasks([...tasks, response.data]);
        }
        setTask('');
      } catch (error) {
        console.error('Error adding/updating task:', error);
      }
    }
  };

  const delTask = async (key) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${key}`);
      setTasks(tasks.filter((item) => item.key !== key));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = (key, value) => {
    setTask(value);
    setEditKey(key);
  };

  return (
    <View style={className`p-5 flex-1 bg-blue-100 gap-3`}>
      <View style={className`flex-row justify-between items-center gap-2`}>
        <TextInput
          placeholder='Enter Todos'
          style={className`flex-1 p-2 rounded-lg text-lg bg-white`}
          value={task}
          onChangeText={setTask}
        />
        <Pressable onPress={addTask} style={className` p-2 text-lg bg-blue-600 text-white rounded-lg`}>
          {editKey !== null ? 'Update' : 'Add'}
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <View style={className`bg-white p-2 my-2 rounded-lg flex-col justify-center items-start gap-2 pt-10`} key={item.key}>
            <Pressable style={className`absolute right-1 top-1`} onPress={() => delTask(item.key)}>
              <Text style={className`bg-blue-100 p-2 px-3 rounded-full text-center`}>X</Text>
            </Pressable>
            <Pressable onPress={() => editTask(item.key, item.value)}>
              <Text style={className`text-lg p-2 w-[330px]`}>{item.value}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default index;
