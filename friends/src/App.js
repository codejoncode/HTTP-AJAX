import React, { Fragment, Component } from 'react';
import axios from 'axios';
import {Route} from 'react-router-dom';  

import './App.css';
import NewFriendForm from './NewFriendForm';
import FriendsList from './FriendsList'; 
import FriendPage from './FriendPage';
import styled from 'styled-components'; 

const FriendsContainer = styled.div`
  display:flex; 
  margin: 0 auto;

`;
const Appbody = styled.div`
  margin: 0 auto; 
  width 1000px; 
  @keyframes backgroundChange {
    from{background-color: white;}
    to{background-color:red}
  }
  li:hover{
    color:white;
    animation-name: backgroundChange;
    animation-duration 2s;
    text-shadow: 1px 3px black;
  }
`;


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      friends: [],
      name: '',
      age: '', 
      email: '',
      gender: '', 
      mounted: false
    };
  }

componentDidMount () {
  axios.get('http://localhost:5000/friends').then((response) => {
     
    this.setState({
      friends: response.data, mounted: true
    })
  })
  .catch(error => console.log(error))
  
}

handleSubmit = () => {
  if(this.state.mounted){
  if(this.state.name.length && this.state.age.length && this.state.email.length){// if they are all greater than zero... 
    // do something with post. 
    if( this.state.email.includes('@') && this.state.email.includes('.') && this.state.email.length > 6){
      if(Number(this.state.age)){
            console.log(parseInt(this.state.age));
            if(this.state.name.length > 2){
              const length = this.state.friends.length; //gets the number to set the id paramater needed because i use it as the key for the map method. 
              const data = {name: this.state.name.slice(), age : this.state.age.slice(), email: this.state.email.slice(), id: length + 1, gender: this.state.gender}// friends data to add. 
              axios.post('http://localhost:5000/friends', data)
                .then(response => {
                  console.log(response, "response"); 
                  this.setState({name: '', age:'', email:'', friends:response.data})
                })
                .catch(error => console.log(error))
            } else {
              alert('Please enter a valid name. ')
            }
      } else{
        alert('please enter a valid age. Must be a valid number no extra characters');
      }

    } else {
      alert('Please enter a valid email address for example joe@something.com'); 
    }
    
    
  } else {
    alert('The name, age and email inputs are required add your friend!');
    }
  }
}

handleOnChange = event => {
  
  this.setState({[event.target.name] : event.target.value})
}

handleDelete = (name) => {
  const friends = this.state.friends.slice(); 
  const friendToDelete = friends.filter(friend => friend.name === name);

  const friendId = friendToDelete[0].id; 
  axios.delete(`http://localhost:5000/friends/${friendId}`)
        .then(response => {
          this.setState({friends:response.data})
        })
        .catch(error => console.log(error))
}
handleUpdate = (name) => {
  const friends = this.state.friends.slice(); 
  const friendToUpdate = friends.filter(friend => friend.name === name);
  const friendId = friendToUpdate[0].id;
  if(this.state.name.length && this.state.age.length && this.state.email.length){// if they are all greater than zero... 
    // do something with post. 
    if( this.state.email.includes('@') && this.state.email.includes('.') && this.state.email.length > 6){
      if(Number(this.state.age)){
            console.log(parseInt(this.state.age));
            if(this.state.name.length > 2){
              const length = this.state.friends.length; //gets the number to set the id paramater needed because i use it as the key for the map method. 
              const data = {name: this.state.name.slice(), age : this.state.age.slice(), email: this.state.email.slice(), id: length + 1}// friends data to add. 
              console.log(name)
              axios.put(`http://localhost:5000/friends/${friendId}`, data)
                .then(response =>{
                  this.setState({friends:response.data, name: '', age: '', email: '', gender:''})
                })
                .catch(error => console.log(error))
            } else {
              alert('Please enter a valid name.');
            }
      } else{
        alert('please enter a valid age. Must be a valid number no extra characters');
      }

    } else {
      alert('Please enter a valid email address for example joe@something.com'); 
    }
    
    
  } else {
    alert('The name, age and email inputs are required update your friend!');
    }
  }

  render() {
    
    return (
      <Fragment>
        <Appbody>
        
        <FriendsContainer>
        <Route exact path = '/' render={(props) => <FriendsList {...props} friends = {this.state.friends.slice()} delete = {this.handleDelete} 
        update = {this.handleUpdate} handleChange ={this.handleOnChange} name = {this.state.name}  age = {this.state.age} 
        email = {this.state.email} handleSubmit ={this.handleSubmit} gender ={this.state.gender}/>} 
        />
        
        {/* <Route path ='/create-friend'  render = {(props) => <NewFriendForm {...props} handleChange ={this.handleOnChange} 
        name = {this.state.name}  age = {this.state.age} email = {this.state.email} handleSubmit ={this.handleSubmit}/>} /> */}
        </FriendsContainer>
        
        <Route path = '/:name' render={(props) => <FriendPage {...props} delete = {this.handleDelete} update = {this.handleUpdate}
        name = {this.state.name} age = {this.state.age} email = {this.state.email} onChange ={this.handleOnChange} friends = {this.state.friends}
        gender = {this.state.gender}/> }/>
        </Appbody>
      </Fragment>
    );
  }
}



export default App;
