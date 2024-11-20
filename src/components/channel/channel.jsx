import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Container } from "@mui/material";
import { ApiService } from "../../service/api.service"
import {ChannelCard, Videos} from "../";
const Channel = () => {
  const { id } = useParams();
  const [channelDetail, setChannelDetail] = useState();
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const dataChannelDetail = await ApiService.fetching(`channels?part=snippet,statistics&id=${id}`)
        setChannelDetail(dataChannelDetail.items[0]);
        const dataVideos = await ApiService.fetching(`search?channelId=${id}&part=snippet%2Cid&order=date&maxResults=50`)
        setVideos(dataVideos?.items);
        
      } catch (error) {
        console.log(error);
      }
    
    };
    getData()
  }, [id]);

  
  return (
    <Box minHeight={"95vh"} mt={'1vh'}>
      <Box>
        <Box width={"100%"} height={'300px'} z-index={10} sx={{backgroundImage:`url(${channelDetail?.brandingSettings?.image?.bannerExternalUrl})`,
      backgroundPosition:'center',backgroundSize:'cover',
      objectFit:'cover',backgroundRepeat:'no-repeat'}}></Box>
        <ChannelCard video={channelDetail} marginTop={'-100px'}/>
      </Box>
      <Container maxWidth={"90%"}>
        <Videos videos={videos} />
      </Container>
    </Box>
  );
};

export default Channel;
