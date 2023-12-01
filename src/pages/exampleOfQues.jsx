// // AskQuestion.js

// import React, { useState } from "react";
// import {
//   TextField,
//   Button,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
//   makeStyles,
// } from "@mui/material";
// import ReactMarkdown from "react-markdown";

// const useStyles = makeStyles((theme) => ({
//   form: {
//     maxWidth: "600px",
//     margin: "0 auto",
//     padding: theme.spacing(2),
//     border: "1px solid #ccc",
//     borderRadius: theme.shape.borderRadius,
//   },
//   input: {
//     marginBottom: theme.spacing(2),
//   },
//   preview: {
//     marginTop: theme.spacing(2),
//     whiteSpace: "pre-wrap",
//   },
// }));

// const AskQuestion = () => {
//   const classes = useStyles();
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [isPreview, setIsPreview] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("");

//   const handleTitleChange = (e) => {
//     setTitle(e.target.value);
//   };

//   const handleContentChange = (e) => {
//     setContent(e.target.value);
//   };

//   const handleCategoryChange = (e) => {
//     setSelectedCategory(e.target.value);
//   };

//   const handleTogglePreview = () => {
//     setIsPreview(!isPreview);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//   };

//   return (
//     <div>
//       <form className={classes.form} onSubmit={handleSubmit}>
//         <TextField
//           className={classes.input}
//           label="Title"
//           variant="outlined"
//           fullWidth
//           value={title}
//           onChange={handleTitleChange}
//         />
//         <br />

//         <FormControl fullWidth className={classes.input}>
//           <InputLabel>Category</InputLabel>
//           <Select
//             value={selectedCategory}
//             onChange={handleCategoryChange}
//             label="Category"
//           >
//             {/* Hardcoded options for demonstration purposes */}
//             <MenuItem value="category1">Category 1</MenuItem>
//             <MenuItem value="category2">Category 2</MenuItem>
//             <MenuItem value="category3">Category 3</MenuItem>
//           </Select>
//         </FormControl>
//         <br />

//         <TextField
//           className={classes.input}
//           multiline
//           rows={5}
//           label="Content"
//           variant="outlined"
//           fullWidth
//           value={content}
//           onChange={handleContentChange}
//         />
//         <br />

//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleTogglePreview}
//         >
//           {isPreview ? "Edit" : "Preview"}
//         </Button>
//         <br />

//         {isPreview && (
//           <div className={classes.preview}>
//             <h3>Preview</h3>
//             <ReactMarkdown>{content}</ReactMarkdown>
//           </div>
//         )}

//         <Button type="submit" variant="contained" color="primary">
//           Submit
//         </Button>
//       </form>
//     </div>
//   );
// };

// export default AskQuestion;

import React, { useState } from "react";
import { Box, Container, TextField, Button, Typography } from "@mui/material";

const AskQuestion = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = () => {
    // Perform actions when the form is submitted, e.g., send the data to the server
    console.log("Title:", title);
    console.log("Content:", content);

    // Clear the form fields
    setTitle("");
    setContent("");
  };

  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Typography variant="h4" mb={2}>
          Ask a New Question
        </Typography>

        <form>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={title}
            onChange={handleTitleChange}
          />

          <TextField
            label="Content"
            variant="outlined"
            multiline
            rows={5}
            fullWidth
            margin="normal"
            value={content}
            onChange={handleContentChange}
          />

          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AskQuestion;
