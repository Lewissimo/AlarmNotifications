import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, Button } from '@mui/material';
import useSound from 'use-sound';
import { collection, query, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/Firebase/Firebase';
import DeleteIcon from '@mui/icons-material/Delete';
import AlarmOffIcon from '@mui/icons-material/AlarmOff';

type Notification = {
  id: string;
  message: string;
  nayaxID: string;
};

const NotificationBox: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [play] = useSound('/notification_sound.mp3');
  const [open, setOpen] = useState(false);
  const [notificationToRemove, setNotificationToRemove] = useState<string | null>(null);
  const prevNotificationsRef = useRef<Notification[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'alertList'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newNotifications: Notification[] = [];
      querySnapshot.forEach((doc) => {
        newNotifications.push({ id: doc.id, ...doc.data() } as Notification);
      });

      // Check for new notifications
      if (newNotifications.length > prevNotificationsRef.current.length) {
        play();
      }

      setNotifications(newNotifications);
      prevNotificationsRef.current = newNotifications;
    });

    return () => unsubscribe();
  }, [play]);

  const handleTurnOffAlarm = async (id: string) => {
    try {
      await updateDoc(doc(db, 'alertList', id), {
        message: 'Alarm wyłączony'
      });
    } catch (error) {
      console.error('Error turning off alarm: ', error);
    }
  };

  const handleOpenDialog = (id: string) => {
    setNotificationToRemove(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setNotificationToRemove(null);
  };

  const handleConfirmRemove = async () => {
    if (notificationToRemove) {
      try {
        await deleteDoc(doc(db, 'alertList', notificationToRemove));
        setNotifications(notifications.filter(notification => notification.id !== notificationToRemove));
      } catch (error) {
        console.error('Error removing notification: ', error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  return (
    <>
      {notifications.length > 0 && (
        <Box sx={{ width: '400px', margin: '0 auto', marginTop: '20px', border: '2px solid #000', borderRadius: '10px', padding: '10px', height: '400px', overflowY: 'auto' }}>
          {notifications.map((notification) => (
            <Paper
              key={notification.id}
              sx={{
                padding: '10px',
                marginBottom: '10px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <Typography>{`${notification.message}: ${notification.nayaxID}`}</Typography>
              <Box>
                <IconButton onClick={() => handleTurnOffAlarm(notification.id)}>
                  <AlarmOffIcon />
                </IconButton>
                <IconButton onClick={() => handleOpenDialog(notification.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleCloseDialog}
      >
        <DialogContent>
          <DialogContentText>
            Czy na pewno chcesz usunąć powiadomienie z historii?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Anuluj</Button>
          <Button onClick={handleConfirmRemove} color="primary">
            Potwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NotificationBox;
