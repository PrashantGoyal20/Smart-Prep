import React from 'react'
import Header from './Header'

const UserManual = () => {
  return (
      <div>
        <Header />
        <div className='app'>
          <div className='particles'>
            {[...Array(200)].map((_, i) => (
              <div
                key={i}
                className='particle'
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              />
            ))}
          </div>
          <div className='particles'>
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className='particle-sun'
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              />
            ))}
          </div>

          <main className='main'>
            <div className='container'>
              <div className='titleSection'>
                <h1 className='title'>
                  <span className='titleGradient'>Your Interview Report</span>
                </h1>
                
              </div>
              <div className='form'>
                  <p>1. Use earphones for better voice control.</p>
                  <p>2. Enter all the required details in the form.</p>
                  <p>3. Give camera and microphone permissions to proceed.</p>
                  <p>4. After entering the interview platform press mike button to speak and close it after concluding your question.</p>
                  <p>5. Wait for a few seconds for response.</p>
                  <p>6. Press leave button to conclude your interview and wait for report.</p>
                  <p>7. Keep yourself motivated and confident.</p>

              </div>
            </div>
          </main>

        </div>

      </div>
  )
}

export default UserManual