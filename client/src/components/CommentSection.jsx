import { useEffect, useState } from "react";
import {
  getComments,
  createComment,
  updateComment,
  deleteComment,
} from "../services/comment.service";
import { useAuth } from "../context/AuthContext";