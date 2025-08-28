'use client'

export default function SimplePage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: 'red', fontSize: '32px' }}>Simple Test Page</h1>
      <p style={{ color: 'blue', fontSize: '18px' }}>
        This page uses inline styles to test if Next.js is working.
      </p>
      <button 
        style={{ 
          backgroundColor: 'green', 
          color: 'white', 
          padding: '10px 20px', 
          border: 'none', 
          borderRadius: '5px',
          fontSize: '16px'
        }}
        onClick={() => alert('Button clicked!')}
      >
        Click Me
      </button>
    </div>
  );
}
