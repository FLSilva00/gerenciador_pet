import React, { useState } from 'react';
import { Text, View, StyleSheet, FlatList, Button, TouchableOpacity, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

function Gerenciar({ navigation }) {
  const [produtos, setProdutos] = useState([]);

  const adicionarProduto = () => {
    const novoProduto = { id: (produtos.length + 1).toString(), title: 'Novo Produto', quantidade: '', preco: '' };
    setProdutos([...produtos, novoProduto]);
  };

  const atualizarProduto = (id, nome, quantidade, preco) => {
    setProdutos(produtos.map(produto =>
      produto.id === id ? { ...produto, title: nome, quantidade, preco } : produto
    ));
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity onPress={() => navigation.navigate('Cadastro', { produto: item, atualizarProduto })}>
        <Text style={styles.title}>{item.title}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.removeButton} onPress={() => setProdutos(produtos.filter(produto => produto.id !== item.id))}>
        <Text style={styles.removeButtonText}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        data={produtos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View style={styles.addButtonContainer}>
        <Button title="Cadastrar Produto" onPress={adicionarProduto} />
      </View>
    </View>
  );
}

function Cadastro({ route, navigation }) {
  const { produto, atualizarProduto } = route.params;
  const [nome, setNome] = useState(produto.title);
  const [quantidade, setQuantidade] = useState(produto.quantidade);
  const [preco, setPreco] = useState(produto.preco);

  const handleSalvar = () => {
    if (nome) {
      atualizarProduto(produto.id, nome, quantidade, preco);
      navigation.goBack();
    } else {
      alert('O nome do produto é obrigatório');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Produto:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome do Produto" />

      <Text style={styles.label}>Quantidade:</Text>
      <TextInput
        style={styles.input}
        value={quantidade}
        onChangeText={(text) => setQuantidade(text.replace(/[^0-9]/g, ''))}
        placeholder="Quantidade"
        keyboardType="numeric"
      />

      <Text style={styles.label}>Preço:</Text>
      <TextInput
        style={styles.input}
        value={preco}
        onChangeText={(text) => setPreco(text.replace(/[^0-9]/g, ''))}
        placeholder="Preço"
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={handleSalvar} />
    </View>
  );
}

function Pedidos() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Ver pedidos</Text>
    </View>
  );
}

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function GerenciarStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Gerenciar" component={Gerenciar} options={{ title: 'Gerenciar Produtos' }} />
      <Stack.Screen name="Cadastro" component={Cadastro} options={{ title: 'Cadastro de Produto' }} />
    </Stack.Navigator>
  );
}

function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Gerenciar"
      screenOptions={{
        tabBarActiveTintColor: 'blue',
      }}
    >
      <Tab.Screen
        name="Home"
        component={GerenciarStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} /> // Ícone de casinha
          ),
        }}
      />
      <Tab.Screen
        name="Pedidos"
        component={Pedidos}
        options={{
          tabBarLabel: 'Pedidos',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="order-bool-descending" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  addButtonContainer: {
    marginTop: 20,
    width: '60%',
  },
  removeButton: {
    backgroundColor: 'red',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default function App() {
  return (
    <NavigationContainer>
      <MyTabs />
    </NavigationContainer>
  );
}
