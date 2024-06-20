import { BrowserRouter as Router, Route, useLocation, Routes } from 'react-router-dom';
import { Home } from './components/pages/Home.view';


const App = () => (
  <Router>
	<Routes>
      <Route path="/" element={<Home/>} />
	  </Routes>
  </Router>
);

export default App;
