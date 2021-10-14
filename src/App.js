import logo from './logo.svg';
import './App.css';
import {Switch, BrowserRouter, Route, Redirect} from 'react-router-dom';
import Home from './component/Home';
import Login from './component/login';
import SignUp from './component/signup';
// import User from './component/User'
import MyLibrary from './component/My_Library'

function App() {
  return(
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/my-library" component={MyLibrary}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;

// <Route exact path="/hstdyw-admin" component={User}/>
