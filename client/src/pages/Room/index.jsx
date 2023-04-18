import { useRef, useEffect, useContext, useState } from "react";
import { SocketContext } from "../../context/SocketContext";
import styled from "styled-components";

const Row = styled.div`
  display: flex;
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid white;
  width: 50%;
  height: 50%;
  transform: rotateY(180deg);
`;

const Room = () => {
  const { peer, socket, room, player_1, player_2 } = useContext(SocketContext);

  const [partnerId, setPartnerId] = useState('')
  const [stream, setStream] = useState()
  const [remoteStream, setRemoteStream] = useState()
  const [connected, setConnected] = useState(false)
  const [answered, setAnswered] = useState(false)

  const userVideo = useRef()
  const partnerVideo = useRef()

  if (connected) {
    if (room.players[player_1].caller) {
      if (stream) {
        const call = peer.call(partnerId, stream)
        console.log('calling');
        call.on('stream', remote => {
          partnerVideo.current.srcObject = remote
          partnerVideo.current.play()
          console.log('user', stream, '\npartner', remote);
          // setRemoteStream(remote)
        })
      } else {
        console.log('stream if off');
      }
    }
  }

  useEffect(() => {
    var getUserMedia = navigator.getUserMedia
    getUserMedia({ video: true }, stream => {
      userVideo.current.srcObject = stream
      userVideo.current.play()
      setStream(stream)
    })

    socket.on('id', data => {
      var conn = peer.connect(data.id);
      setPartnerId(data.id)
    })

    peer.on('connection', () => {
      console.log('connected');
      setConnected(true)
    });

    peer.on('call', call => {
      getUserMedia({ video: true }, stream => {
        call.answer(stream)
        console.log('answering');
      })
      call.on('stream', remote => {
        partnerVideo.current.srcObject = remote
        partnerVideo.current.play()
        // setRemoteStream(remote)
      })
    })
    
  }, []);

  let UserVideo;
  UserVideo = (
    <Video ref={userVideo} />
  );

  let PartnerVideo;
  PartnerVideo = (
    <Video ref={partnerVideo} />
  );

  return (
    <>
      <Row>
        {UserVideo}
        {PartnerVideo}
      </Row>
    </>
  );
};

export default Room;
