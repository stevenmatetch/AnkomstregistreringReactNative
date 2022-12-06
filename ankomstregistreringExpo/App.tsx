 import AppRoute from "./src/navigation/navigator";
 import {Provider} from 'react-redux';
 import {store} from './src/redux/store';

 const App = () => {
   return (
    <Provider store={store}>
    <AppRoute />
   </Provider>
   );
 };
 
 export default App;
 