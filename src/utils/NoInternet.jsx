import React, { useEffect } from 'react';
import { Modal } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { listenToNetworkChanges } from '../../redux/actions/network';
import NO_INTERNET from '../../assets/json/no_internet.json';
import Lottie from 'lottie-react';

const NoInternet = () => {
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.network.isOnline);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    const cleanup = dispatch(listenToNetworkChanges());
    setOpen(!isOnline);

    return cleanup;
  }, [dispatch, isOnline]);

  return (
    <Modal
      opened={open}
      onClose={() => setOpen(false)}
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      overlayProps={{
        opacity: 1, 
        blur: 3, 
      }}
      styles={{
        content: {
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: 0,
        },
      }}
    >
      <Lottie
        animationData={NO_INTERNET}
        loop
        autoplay
        style={{ height: 400, width: 400 }}
      />
    </Modal>
  );
};

export default NoInternet;