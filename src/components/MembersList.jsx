import React from 'react';
import { FaUser } from 'react-icons/fa';
import './MembersList.css';

const MembersList = ({ members }) => {
  console.log('MembersList component received members:', members);
  console.log('Members type:', typeof members);
  console.log('Is members an array?', Array.isArray(members));
  console.log('Members length:', members?.length);

  if (!members || members.length === 0) {
    console.log('No members data available');
    return null;
  }

  return (
    <div className="members-list-container">
      <h3 className="members-list-title">Project Members</h3>
      <div className="members-list">
        {members.map((member) => {
          console.log('Rendering member:', member);
          return (
            <div key={member._id} className="member-item">
              {member.picture ? (
                <img 
                  src={member.picture} 
                  alt={member.name} 
                  className="member-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = null;
                    e.target.parentElement.classList.add('fallback-avatar');
                  }}
                />
              ) : (
                <div className="fallback-avatar">
                  <FaUser />
                </div>
              )}
              <span className="member-name">{member.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MembersList; 