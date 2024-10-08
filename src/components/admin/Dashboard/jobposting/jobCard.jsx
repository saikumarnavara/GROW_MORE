import React, { useState } from "react";
import "./AdminJobCard.css";
import { useDispatch, useSelector } from "react-redux";
import { JobService } from "../../../../services/JobPostingService";
import {
  setLoader,
  setJobs,
  setCurrentAppliedJob,
} from "../../../../redux-store/slices/JobPostingSlice";
import EditJobModal from "./EditJobModal"; // Import the modal component
import Loader from "../../../containers/loader/Loader";
import Toast from "../../../containers/toast/Toast";

const JobCard = ({ title, overview, active, id }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state?.job_posting);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const deleteJobHandler = async () => {
    setToast(false);
    dispatch(setLoader(true));
    let payload = {
      id: id,
    };
    const response = await JobService.DeleteJob({
      payload,
    });
    if (response.status === 200) {
      setToastMessage("Job Deleted Successfully");
      setToast(true);
      const res = await JobService.GetJob();
      if (res.status === 200) {
        dispatch(setJobs(res.data));
      }
    }
  };

  const handleEditOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
  };

  const handleSave = async (updatedJob) => {
    // Handle save logic, such as updating the job details in your state or sending it to the backend
    // Simulating API call to update job details
    setToast(false);
    dispatch(setLoader(true));
    const response = await JobService.EditJob(updatedJob);
    if (response.status === 200) {
      setToastMessage("Job Updated Successfully");
      setToast(true);

      const res = await JobService.GetJob();
      if (res.status === 200) {
        dispatch(setJobs(res.data));
      }
    }

    handleEditClose();
  };

  return (
    <div className="job-card">
      <h2 className="job-title">{title}</h2>
      <p className="job-overview">
        {overview &&
          overview.map((item) => {
            return <div key={item}>{item}</div>;
          })}
        <p className="job-status">{active ? "Active" : "Inactive"}</p>
      </p>

      <div className="button-con">
        <button className="apply-button" onClick={handleEditOpen}>
          Edit
        </button>
        <button className="apply-button" onClick={deleteJobHandler}>
          Delete
        </button>
      </div>

      <EditJobModal
        open={editModalOpen}
        onClose={handleEditClose}
        onSave={handleSave}
        job={{ title, overview, active, id }}
      />
      {loading && <Loader />}
      {toast && <Toast msg={toastMessage} />}
    </div>
  );
};

export default JobCard;
