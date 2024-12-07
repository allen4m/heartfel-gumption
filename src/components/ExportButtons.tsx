import React, { useState } from 'react';
import { Download, Mail } from 'lucide-react';
import { jsPDF } from 'jspdf';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';
import { CourseEntry } from '../types';
import UserInfoModal from './UserInfoModal';

type ExportButtonsProps = {
  studentName: string;
  schoolName: string;
  courses: CourseEntry[];
  gpa: number | null;
  country: string;
};

type UserInfo = {
  fullName: string;
  email: string;
};

export default function ExportButtons({
  studentName,
  schoolName,
  courses,
  gpa,
  country
}: ExportButtonsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'download' | 'email'>('download');
  const [isLoading, setIsLoading] = useState(false);

  const generatePDF = (userInfo: UserInfo) => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.text('GPA Calculation Results', 20, 20);
    
    // Add user info
    doc.setFontSize(12);
    doc.text(`Generated for: ${userInfo.fullName}`, 20, 35);
    doc.text(`Email: ${userInfo.email}`, 20, 45);
    
    // Add student info
    doc.text(`Student Name: ${studentName}`, 20, 60);
    doc.text(`School: ${schoolName}`, 20, 70);
    doc.text(`Country System: ${country}`, 20, 80);
    doc.text(`Cumulative GPA: ${gpa?.toFixed(2) || 'N/A'}`, 20, 90);
    
    // Add courses table
    doc.text('Courses:', 20, 105);
    let yPos = 115;
    
    courses.forEach((course, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(`${index + 1}. ${course.course} - Credits: ${course.credits}, Grade: ${course.grade}`, 20, yPos);
      yPos += 10;
    });
    
    // Add footer
    const timestamp = new Date().toLocaleString();
    doc.setFontSize(10);
    doc.text(`Generated on: ${timestamp}`, 20, doc.internal.pageSize.height - 10);
    
    // Save the PDF
    doc.save(`GPA_Results_${userInfo.fullName.replace(/\s+/g, '_')}.pdf`);
    toast.success('PDF downloaded successfully!');
  };

  const sendEmail = async (userInfo: UserInfo) => {
    try {
      setIsLoading(true);
      const templateParams = {
        to_email: userInfo.email,
        user_name: userInfo.fullName,
        student_name: studentName,
        school_name: schoolName,
        country: country,
        gpa: gpa?.toFixed(2) || 'N/A',
        courses: courses.map(c => 
          `${c.course} (Credits: ${c.credits}, Grade: ${c.grade})`
        ).join('\n')
      };

      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      toast.success('Results sent to your email!');
      setIsModalOpen(false);
    } catch (error) {
      toast.error('Failed to send email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = (type: 'download' | 'email') => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleSubmit = (userInfo: UserInfo) => {
    if (modalType === 'download') {
      generatePDF(userInfo);
      setIsModalOpen(false);
    } else {
      sendEmail(userInfo);
    }
  };

  return (
    <div className="flex flex-col items-end">
      <div className="flex gap-3">
        <button
          onClick={() => handleAction('download')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download Results
        </button>
        <button
          onClick={() => handleAction('email')}
          className="inline-flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
        >
          <Mail className="w-4 h-4" />
          Email Results
        </button>
      </div>

      <UserInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        type={modalType}
        isLoading={isLoading}
      />
    </div>
  );
}