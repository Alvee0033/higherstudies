"use client";

import * as React from "react";
import { X, FileText, Send } from "lucide-react";
import { ApplicationItem, ApplicationStatus } from "./application-types";
import { ApplicationProgressStage } from "./form/form-status-stepper";
import { FormUniversityDetails } from "./form/form-university-details";
import { FormImportantDates } from "./form/form-important-dates";
import { FormApplicationProgress } from "./form/form-application-progress";
import { FormAcademicDocuments } from "./form/form-academic-documents";
import { FormTestScores } from "./form/form-test-scores";
import { FormAdditionalInfo } from "./form/form-additional-info";

interface ApplicationFormModalProps {
  initialApplication?:ApplicationItem;
  initialStatus?: ApplicationStatus;
  onClose: () => void;
  onAdd: (app: ApplicationItem) => void | Promise<void>;
}

export function ApplicationFormModal({
  initialApplication,
  initialStatus = "Preparing",
  onClose,
  onAdd,
}: ApplicationFormModalProps) {
  const [testScores,setTestScores]=React.useState<Record<string,string>>(initialApplication?.details??{});
  const [documents,setDocuments]=React.useState<Record<string,string>>(initialApplication?.documents??{});
  // 1. University & Program Details
  const [university, setUniversity] = React.useState(initialApplication?.universityName??"");
  const [country, setCountry] = React.useState(initialApplication?.country??"");
  const [program, setProgram] = React.useState(initialApplication?.program??"");
  const [degreeLevel, setDegreeLevel] = React.useState(initialApplication?.details?.degreeLevel??"Doctorate / PhD");
  const [department, setDepartment] = React.useState(initialApplication?.department??"");
  const [programType, setProgramType] = React.useState(initialApplication?.details?.programType??"Full-time");
  const [intake, setIntake] = React.useState(initialApplication?.intake??"");
  const [round, setRound] = React.useState(initialApplication?.details?.round??"Round 1");

  // 2. Important Dates
  const [appDate, setAppDate] = React.useState(initialApplication?.submittedDate??"");
  const [deadline, setDeadline] = React.useState(initialApplication?.deadline??"");
  const [decisionDate, setDecisionDate] = React.useState(initialApplication?.details?.decisionDate??"");
  const [enrollmentDate, setEnrollmentDate] = React.useState(initialApplication?.details?.enrollmentDate??"");

  // 3. Application Progress & Status Stepper
  const [currentStage, setCurrentStage] = React.useState<ApplicationProgressStage>(
    (initialStatus as ApplicationProgressStage) || "Preparing"
  );
  const [notes, setNotes] = React.useState(initialApplication?.details?.notes??"");

  // 6. Additional Info
  const [feeStatus, setFeeStatus] = React.useState(initialApplication?.details?.feeStatus??"Not paid");
  const [feeAmount, setFeeAmount] = React.useState(initialApplication?.details?.feeAmount??"");
  const [appMethod, setAppMethod] = React.useState(initialApplication?.details?.appMethod??"Online Portal");
  const [trackingId, setTrackingId] = React.useState(initialApplication?.applicationId??"");

  const [error,setError]=React.useState("");
  const [saving,setSaving]=React.useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const mappedStatus: ApplicationStatus =
      currentStage === "Accepted"
        ? "Accepted"
        : currentStage === "Rejected"
        ? "Rejected"
        : currentStage === "Submitted"
        ? "Submitted"
        : currentStage === "Interview"
        ? "Interview"
        : currentStage === "Not Started"
        ? "Not Started"
        : "Preparing";

    setError('');setSaving(true);
    try {
      if(!university.trim()||!program.trim()||!intake.trim()||!country.trim())throw new Error('University, programme, intake and country are required');
      await onAdd({id:'',universityName:university.trim(),program:program.trim(),department,intake,deadline,country,status:mappedStatus,applicationId:trackingId,submittedDate:appDate,progressPercent:initialApplication?.progressPercent??0,checklist:initialApplication?.checklist??[],details:{...testScores,degreeLevel,programType,round,decisionDate,enrollmentDate,notes,feeStatus,feeAmount,appMethod},documents});
      onClose();
    }catch(e){setError(e instanceof Error?e.message:'Unable to save');}finally{setSaving(false);}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl sm:rounded-3xl w-full max-w-[1040px] max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Header matching Figma Screen 11 */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#EAF5FF] flex items-center justify-center text-[#1476F2] shrink-0">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-heading">
                Add New Application
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in the details below to add and track your university application
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {error&&<p role="alert" className="px-6 text-sm text-rose-600">{error}</p>}
        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Upper 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* Left Column: Sections 1, 2, 3 */}
            <div className="space-y-6">
              <FormUniversityDetails
                university={university}
                setUniversity={setUniversity}
                country={country}
                setCountry={setCountry}
                program={program}
                setProgram={setProgram}
                degreeLevel={degreeLevel}
                setDegreeLevel={setDegreeLevel}
                department={department}
                setDepartment={setDepartment}
                programType={programType}
                setProgramType={setProgramType}
                intake={intake}
                setIntake={setIntake}
                round={round}
                setRound={setRound}
              />

              <FormImportantDates
                appDate={appDate}
                setAppDate={setAppDate}
                deadline={deadline}
                setDeadline={setDeadline}
                decisionDate={decisionDate}
                setDecisionDate={setDecisionDate}
                enrollmentDate={enrollmentDate}
                setEnrollmentDate={setEnrollmentDate}
              />

              <FormApplicationProgress
                currentStage={currentStage}
                onChangeStage={setCurrentStage}
                notes={notes}
                setNotes={setNotes}
              />
            </div>

            {/* Right Column: Sections 4, 5 */}
            <div className="space-y-6">
              <FormAcademicDocuments initial={documents} onChange={setDocuments}/>

              <FormTestScores initial={testScores} onChange={(key,value)=>setTestScores(previous=>({...previous,[key]:value}))}/>
            </div>
          </div>

          {/* Bottom Section: Section 6 Additional Info */}
          <div className="pt-2">
            <FormAdditionalInfo
              feeStatus={feeStatus}
              setFeeStatus={setFeeStatus}
              feeAmount={feeAmount}
              setFeeAmount={setFeeAmount}
              appMethod={appMethod}
              setAppMethod={setAppMethod}
              trackingId={trackingId}
              setTrackingId={setTrackingId}
            />
          </div>

          {/* Sticky Form Footer matching Figma */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit" disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#1476F2] hover:bg-[#0963D6] text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4" />
              <span>Add Application</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
