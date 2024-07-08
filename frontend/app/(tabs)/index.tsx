import { View, Text, TextInput, Pressable, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import className from 'twrnc';
import axios from 'axios';

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
          const response = await axios.put(`http://localhost:3000/api/tasks/${editKey}`, { value: task });
          setTasks(tasks.map((item) => (item._id === editKey ? response.data : item)));
          setEditKey(null);
        } else {
          const response = await axios.post('http://localhost:3000/api/tasks', { value: task });
          setTasks([...tasks, response.data]);
        }
        setTask('');
      } catch (error) {
        console.error('Error adding/updating task:', error);
      }
    }
  };

  const delTask = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/tasks/${id}`);
      setTasks(tasks.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const editTask = (id, value) => {
    setTask(value);
    setEditKey(id);
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
        <Pressable onPress={addTask} style={className`p-2 text-lg bg-blue-600 text-white rounded-lg`}>
          <Text>{editKey !== null ? 'Update' : 'Add'}</Text>
        </Pressable>
      </View>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={className`bg-white p-2 my-2 rounded-lg flex-col justify-center items-start gap-2 pt-10`} key={item._id}>
            <Pressable style={className`absolute right-1 top-1`} onPress={() => delTask(item._id)}>
              <Text style={className`bg-blue-100 p-2 px-3 rounded-full text-center`}>X</Text>
            </Pressable>
            <Pressable onPress={() => editTask(item._id, item.value)}>
              <Text style={className`text-lg p-2 w-[330px]`}>{item.value}</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
};

export default index;
