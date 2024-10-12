import React from 'react';
import pic from '../../assets/images/GV .jpg'
import './FacultyCard.css';
const FacultyCard = () => {
  const designationBoxStyle = {
    // Set the background color to light green
    padding: '5px 10px',
    borderRadius: '10px',
    marginBottom: '10px', // Add spacing between photo and designation
  };
  return (

    <div className="faculty-container">
      <div style={designationBoxStyle}>
        <div className="image-container" style={{ marginTop: '20px' }}>
          <img className='faculty-image' src={pic} alt="Your Image" />
        </div>
        <div className="designation-box">

        </div>
      </div>
      <div className="faculty-content">
        <h2 className="content-heading">GAURAV VERMA</h2>
        <h3 className="content-subheading">Assistant Professor</h3>
        <br />
        <table style={{ margin: '0 auto' }}>
          <tbody>
            <tr>
              <td style={{ paddingRight: '10px' }}>DEPARTMENT:</td>
              <td>School of Renewable Energy and Efficiency</td>
            </tr>
            <tr>
              <td style={{paddingRight: '10px' }}>QUALIFICATION:</td>
              <td>P.hD Completed</td>
            </tr>
            <tr>
              <td style={{ paddingRight: '10px' }}>EMAIL:</td>
              <td>gaurav@nitkkr.ac.in</td>
            </tr>
            <tr>
              <td style={{  paddingRight: '10px' }}>PHONE NO.:</td>
              <td>01755235910</td>
            </tr>
          </tbody>
        </table>


      </div>
    </div>
  );
};
export default FacultyCard;