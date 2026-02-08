import React, { useState } from 'react';
import CosmicScene from './components/Visuals/CosmicScene';
import Header from './components/Overlays/Header';
import Footer from './components/Overlays/Footer';
import Modal from './components/Overlays/Modal';
import { Avatar } from './types';
import { avatars, vishwaroopData } from './data';

const App: React.FC = () => {
  const [selectedAvatar, setSelectedAvatar] = useState<Avatar | null>(null);

  const handleSelectAvatar = (avatar: Avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleSelectVishnu = () => {
    setSelectedAvatar(vishwaroopData);
  }

  const handleCloseModal = () => {
    setSelectedAvatar(null);
  };

  const handleNext = () => {
    if (!selectedAvatar) return;
    if (selectedAvatar.id === 0) {
        // From Vishwaroop, go to 1
        setSelectedAvatar(avatars[0]);
        return;
    }
    const nextId = selectedAvatar.id === 10 ? 1 : selectedAvatar.id + 1;
    setSelectedAvatar(avatars.find(a => a.id === nextId) || null);
  };

  const handlePrev = () => {
    if (!selectedAvatar) return;
    if (selectedAvatar.id === 0) {
        // From Vishwaroop, go to 10
        setSelectedAvatar(avatars[9]);
        return;
    }
    const prevId = selectedAvatar.id === 1 ? 10 : selectedAvatar.id - 1;
    setSelectedAvatar(avatars.find(a => a.id === prevId) || null);
  };

  return (
    <div className="relative w-full h-screen bg-[#050510] overflow-hidden">
      
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <CosmicScene 
          selectedAvatar={selectedAvatar} 
          onSelectAvatar={handleSelectAvatar} 
          onSelectVishnu={handleSelectVishnu}
        />
      </div>

      {/* UI Overlay Layer */}
      <Header />
      <Footer />

      {/* Interactive Modal */}
      {selectedAvatar && (
        <Modal 
          avatar={selectedAvatar} 
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrev={handlePrev}
        />
      )}
      
    </div>
  );
};

export default App;
