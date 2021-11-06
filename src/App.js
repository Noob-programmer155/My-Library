import logo from './logo.svg';
import './App.css';
import {Switch, BrowserRouter, Route, Redirect} from 'react-router-dom';
import Home from './component/Home';
import Login from './component/login';
import SignUp from './component/signup';
import User from './component/User_Container';
import MyLibrary from './component/My_Library';
import VerOAuth from './component/verifyOauth';
import Settings from './component/Setting';
import Ver from './component/verify';

function App() {
  return(
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path="/" component={Home}/>
          <Route exact path="/login" component={Login}/>
          <Route exact path="/signup" component={SignUp}/>
          <Route exact path="/my-library" component={MyLibrary}/>
          <Route exact path="/verify-user" component={VerOAuth}/>
          <Route exact path="/validate" component={Ver}/>
          <Route exact path="/hstdyw-admin" component={User}/>
          <Route exact path="/setting" component={Settings}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
