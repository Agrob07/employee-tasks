import React from "react";
import { toast } from "react-toastify";

import Modal from "./Modal";
import { api } from "../../api";
import EmployeeForm from "../Employees/EmployeeForm";
import useEmployees from "../../hooks/useEmployees";
import { initialActions } from "../../util/data/actions";
import { employeesApi } from "../../util/config";

const EmployeeModal = ({
  empId,
  actions,
  setActions,
  onEditEmployee,
}) => {
  const { setEmployees } = useEmployees();

  const handleCreation = async (values) => {
    try {
      const data = await api.createRequest(employeesApi, values);
      toast.success(
        `Employee (ID: ${data.id}) successfully created !`
      );
      const newData = await api.getData(employeesApi);
      setEmployees(newData);
    } catch (error) {
      toast.error("Something went Wrong!");
    }
    setActions(initialActions);
  };
  const handleDelete = async () => {
    try {
      await api.deleteById(employeesApi, empId);
      toast.success(`Employee (ID: ${empId}) successfully deleted !`);
      const newData = await api.getData(employeesApi);
      setEmployees(newData);
    } catch (error) {
      toast.error("Something went Wrong!");
    }

    setActions(initialActions);
  };

  const handleEdit = async (val) => {
    try {
      await api.updateById(employeesApi, val.id, val);
      toast.success(`Employee (ID: ${empId}) successfully updated !`);
      const newData = await api.getData(employeesApi);
      setEmployees(newData);
    } catch (error) {
      toast.error("Something went Wrong!");
    }
    setActions(initialActions);
  };

  const handleConfirm = (val) => {
    switch (true) {
      case actions.create:
        return handleCreation(val);
      case actions.update:
        return handleEdit(val);
      case actions.delete:
        return handleDelete();
      default:
        return (() => console.log("Default case"))();
    }
  };

  const handleCancel = () => {
    setActions(initialActions);
  };
  return (
    <>
      {(actions.create || actions.update) && (
        <EmployeeForm
          onEditEmployee={onEditEmployee}
          isModalOpen={
            actions.delete || actions.update || actions.create
          }
          handleSubmit={handleConfirm}
          handleCancel={handleCancel}
        />
      )}
      <Modal
        isOpen={actions.delete}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
      >
        <p>Are you Sure?</p>
      </Modal>
    </>
  );
};

export default EmployeeModal;
