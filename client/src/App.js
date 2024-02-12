// App.js
import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post('http://localhost:8080/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setMessage(response.data.message);
      setDownloadLink(response.data.downloadLink);
      console.log('Download link:', response.data.downloadLink);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    //const formData = new FormData();
    //formData.append('file', file);

    try {
      const fileReader = new FileReader();
      const response = await axios.get('http://localhost:8080/download', {
        responseType: "blob",
      }).then((res) => {
        console.log(res);
        fileReader.readAsDataURL(new Blob([res.data]));
      })
          .catch((err) => console.log(err));

      fileReader.addEventListener("loadend", () => {
        const blobString = fileReader.result;
        const link = document.createElement("a");
        link.href = blobString;
        link.setAttribute("download", `report-${new Date()}.csv`);
        document.body.appendChild(link);
        link.click();
      });


    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>CSV Upload and Processing</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={handleDownload}>Download Report</button>
      {loading && <div>Loading...</div>}
      {message && <div>{message}</div>}
      {downloadLink && <a href={downloadLink}>Download Report</a>}
    </div>
  );
}

export default App;
