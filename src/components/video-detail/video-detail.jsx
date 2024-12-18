import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiService } from "../../service/api.service";
import { Avatar, Box, Chip, Stack, Typography } from "@mui/material";
import ReactPlayer from "react-player";
import Linkify from "react-linkify";
import {
  CheckCircle,
  FavoriteOutlined,
  MarkChatRead,
  Tag,
  Visibility,
} from "@mui/icons-material";
import { Loader, Videos } from "../";
const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [relatedVideo, setRelatedVideo] = useState([]);
  const { id } = useParams();
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await ApiService.fetching(
          `videos?part=snippet,statistics&id=${id}`
        );
        setVideoDetail(data.items[0]);

        const reletedData = await ApiService.fetching(
          `search?part=snippet&relatedToVideoId=${id}&type=video`
        );
        setRelatedVideo(reletedData.items);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, [id]);

  if (!videoDetail?.snippet) return <Loader />;
  if (!relatedVideo) return <Loader />;

  return (
    <Box minHeight={"90hv"} ml={"50px"} mb={10}>
      <Box display={"flex"} sx={{ flexDirection: { xs: "column", md: "row" } }}>
        <Box width={{ xs: "100%", md: "75%" }}>
          <ReactPlayer
            url={`https://www.youtube.com/watch?v=${id}`}
            controls={true}
            className={"react-player"}
          />
          {videoDetail?.snippet?.tags?.map((item, idx) => (
            <Chip
              key={idx}
              label={item}
              sx={{ marginTop: "10px", cursor: "pointer", ml: "10px" }}
              deleteIcon={<Tag />}
              onDelete={() => {}}
              variant="outlined"
            />
          ))}
          <Typography variant="h5" fontWeight={"bold"} p={2}>
            {videoDetail?.snippet?.title}
          </Typography>
          <Typography variant="subtitle2" p={2} sx={{ opacity: ".7" }}>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a
                  href={decoratedHref}
                  key={key}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  {decoratedText}
                </a>
              )}
            >
              <pre style={{ whiteSpace: "pre-wrap",letterSpacing: "-1px" }}>
                {videoDetail?.snippet?.description}
              </pre>
            </Linkify>
          </Typography>
          <Stack direction="row" gap="20px" alignItems="center" py={1} px={2}>
            <Stack
              sx={{ opacity: ".7" }}
              direction={"row"}
              alignItems={"center"}
              gap={"3px"}
            >
              <FavoriteOutlined />
              {parseInt(
                videoDetail?.statistics?.likeCount
              ).toLocaleString()}{" "}
              Likes
            </Stack>
             <Stack
              sx={{ opacity: ".7" }}
              direction={"row"}
              alignItems={"center"}
              gap={"3px"}
            >
              <Visibility />
              {parseInt(
                videoDetail?.statistics?.viewCount
              ).toLocaleString()}{" "}
              Views
            </Stack>
            <Stack
              sx={{ opacity: ".7" }}
              direction={"row"}
              alignItems={"center"}
              gap={"3px"}
            >
              <MarkChatRead />
              {parseInt(
                videoDetail?.statistics?.commentCount
              ).toLocaleString()}{" "}
              Comment
            </Stack>
          </Stack>
          <Stack direction="row" py={1} px={2}>
          <Link to={`/channel/${videoDetail?.snippet?.channelId}`}>
            <Stack
              direction={"row"}
              alignItems={"center"}
              gap={"5px"}
              marginTop={"5px"}
            >
              <Avatar
                alt={videoDetail.snippet.channelTitle}
                src={videoDetail.snippet.thumbnails.default.url}
              />
              <Typography variant="subtitle2" color="gray">
                {videoDetail.snippet.channelTitle}
                <CheckCircle
                  sx={{ fontSize: "12px", color: "gray", ml: "5px" }}
                />
              </Typography>
            </Stack>
          </Link>
          </Stack>
        </Box>
        <Box
          width={{ xs: "100%", md: "25%" }}
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
          overflow="scroll"
          maxHeight="120vh"
          ml={'50px'}
        >
          <Videos videos={relatedVideo} />
        </Box>
      </Box>
    </Box>
  );
};

export default VideoDetail;
