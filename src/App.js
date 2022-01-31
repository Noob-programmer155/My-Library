import './App.css';
import {Switch, BrowserRouter, Route} from 'react-router-dom';
import Home from './component/Home';
import Login from './component/subcomponent/Auth/AuthPage/login';
import SignUp from './component/subcomponent/Auth/AuthPage/signup';
import User from './component/AdminHome';
import MyLibrary from './component/Library';
import VerOAuth from './component/subcomponent/Auth/AuthPage/verifyOauth';
import Settings from './component/subcomponent/Auth/AuthUserComponent/Setting';
import Ver from './component/subcomponent/Auth/AuthPage/verify';

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
