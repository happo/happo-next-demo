import React from 'react';

export default function Box() {
  return (
    <div className="box">
      <style jsx>{`
        .box {
          padding: 20px;
          border: 1px solid red;
          background-color: pink;
          height: 100px;
          width: 100px;
          border-radius: 3px;
        }
      `}</style>
    </div>
  );
}
