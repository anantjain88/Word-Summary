import './App.css';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
// import RangeSlider from 'react-bootstrap/RangeSlider';
import RangeSlider from 'react-bootstrap-range-slider';
import { Button } from 'react-bootstrap';
import axios from 'axios';

function App() {
  /// Setting the model
  const [selectedModelValue, setSelectedModelValue] = useState('Select Model');
  const handleSelect = eventKey => {
    // Set the selected model to the option that was clicked
    setSelectedModelValue(eventKey);
  };

  /// set temperature
  const [temperatureValue, setTempratureValue] = useState(0);
  const handleTemperature = event => {
    setTempratureValue(event.target.value);
  };

  /// set files
  const [files, setFiles] = useState([]);
  const handleFileInputChange = event => {
    const fileList = event.target.files[0];
    // console.log(fileList)
    setFiles([...files, fileList]);
  };

  /// on submit
  const handleSubmit = event => {
    // event.preventDefault();
    const formData = new FormData();
    /// fill form data object
    formData.append('temperature', temperatureValue);
    formData.append('model', selectedModelValue);
    // formData.append('file', files);
    for (let i = 0; i < files.length; i++) {
      formData.append('file', files[i]);
    }

    axios
      .post('http://localhost:7001/api/summarize', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        // responseType: 'blob',
      })
      .then(res => {
        alert(res.data);
      })
      .catch(error => {
        alert(error.response.data.message);
      });
    // });
  };

  return (
    <div className="container">
      <Form.Group controlId="formFileSm" className="mb-3">
        <Form.Label>Select .docx files</Form.Label>
        <Form.Control type="file" size="sm" onChange={handleFileInputChange} />
        {files.length > 0 && (
          <ul>
            {files.map(file => (
              <li id={file.name} key={file.name}>
                {file.name}
              </li>
              // console.log(file.name)
            ))}
          </ul>
        )}
      </Form.Group>

      <Form.Label>Set Temperature</Form.Label>
      <RangeSlider
        value={temperatureValue}
        onChange={handleTemperature}
        min={0}
        max={1}
        step={0.1}
      />

      <Dropdown onSelect={handleSelect}>
        <Dropdown.Toggle variant="success" id="dropdown-basic">
          {selectedModelValue}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item eventKey="text-davinci-002">
            text-davinci-002
          </Dropdown.Item>
          <Dropdown.Item eventKey="text-davinci-003">
            text-davinci-003
          </Dropdown.Item>
          <Dropdown.Item eventKey="gpt-3.5-turbo">gpt-3.5-turbo</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <br />
      <Button type="submit" onClick={handleSubmit}>
        Submit
      </Button>

      {/* </Form> */}
    </div>
  );
}

export default App;
