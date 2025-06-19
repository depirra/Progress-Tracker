-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jun 19, 2025 at 06:21 PM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sinar_baja_bumi`
--

-- --------------------------------------------------------

--
-- Table structure for table `attachments`
--

CREATE TABLE `attachments` (
  `id` int NOT NULL,
  `project_id` int NOT NULL,
  `filename` varchar(255) DEFAULT NULL,
  `filepath` varchar(255) DEFAULT NULL,
  `note` text,
  `uploaded_by` int NOT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `tanggal` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `attachments`
--

INSERT INTO `attachments` (`id`, `project_id`, `filename`, `filepath`, `note`, `uploaded_by`, `uploaded_at`, `tanggal`) VALUES
(7, 5, NULL, NULL, 'Pembelian Material', 1, '2025-06-19 17:47:28', '2025-06-20 00:47:28'),
(8, 4, NULL, NULL, 'Pembelian Material\r\n', 1, '2025-06-19 17:53:35', '2025-06-20 00:53:35'),
(9, 4, NULL, NULL, 'Persiapan Loading Material', 1, '2025-06-19 17:54:01', '2025-06-20 00:54:01'),
(10, 4, 'Flowchart ADA.jpg', 'uploads/FlowchartADA-68544efae7548.jpg', 'Gambar Teknik', 1, '2025-06-19 17:55:06', '2025-06-20 00:55:06');

-- --------------------------------------------------------

--
-- Table structure for table `clients`
--

CREATE TABLE `clients` (
  `id` int NOT NULL,
  `nama` varchar(100) NOT NULL,
  `alamat` text NOT NULL,
  `kontak` varchar(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clients`
--

INSERT INTO `clients` (`id`, `nama`, `alamat`, `kontak`, `email`, `created_at`) VALUES
(1, 'PT Bangun Jaya Abadi', 'Jl. Raya Bekasi No. 123', '08123456789', 'info@bangunjaya.com', '2025-06-19 09:59:48'),
(2, 'PT Konstruksi Maju Bersama', 'Jl. Sudirman No. 456, Jakarta', '08234567890', 'kontak@kmb.co.id', '2025-06-19 09:59:48'),
(3, 'PT MAKMUR JAYA', 'Karawang', '08123456789', 'makmurjaya@gmail.com', '2025-06-19 12:15:11');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `detail` text NOT NULL,
  `status` enum('Perencanaan','Persiapan','Produksi','Pengawasan','Penyelesaian') NOT NULL,
  `progress` int NOT NULL,
  `created_by` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `title`, `detail`, `status`, `progress`, `created_by`, `client_id`, `created_at`) VALUES
(1, 'Pembangunan Gudang Baja', 'Pembangunan gudang penyimpanan material baja untuk PT Bangun Jaya Abadi', 'Produksi', 60, 1, 1, '2025-06-19 09:59:48'),
(2, 'Renovasi Kantor Pusat', 'Renovasi struktur kantor pusat PT Konstruksi Maju Bersama', 'Pengawasan', 75, 1, 2, '2025-06-19 09:59:48'),
(4, 'Pembangunan Jembatan Layang', 'Pembangunan Jembatan Telukjambe', 'Persiapan', 30, 1, 3, '2025-06-19 12:15:50'),
(5, 'Perbaikan Jalan Raya', 'Projek perbaikan jalan raya tuparev', 'Penyelesaian', 100, 1, 3, '2025-06-19 16:26:22');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `role` enum('admin','engineer','client') NOT NULL,
  `client_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama_lengkap`, `role`, `client_id`, `created_at`) VALUES
(1, 'admin', 'admin123', 'Devi Rahmawati', 'admin', NULL, '2025-06-19 09:59:48'),
(2, 'engineer', 'engineer123', 'Gagas Cahya', 'engineer', NULL, '2025-06-19 09:59:48'),
(3, 'client1', 'client123', 'PT Bangun Jaya Abadi', 'client', 1, '2025-06-19 09:59:48'),
(4, 'client2', 'client234', 'PT Konstruksi Maju Bersama', 'client', 2, '2025-06-19 09:59:48'),
(5, 'client3', 'client345', 'PT MAKMUR JAYA', 'client', 3, '2025-06-19 12:15:11');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `attachments`
--
ALTER TABLE `attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `project_id` (`project_id`),
  ADD KEY `uploaded_by` (`uploaded_by`);

--
-- Indexes for table `clients`
--
ALTER TABLE `clients`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `client_id` (`client_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `attachments`
--
ALTER TABLE `attachments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `clients`
--
ALTER TABLE `clients`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `attachments`
--
ALTER TABLE `attachments`
  ADD CONSTRAINT `attachments_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`),
  ADD CONSTRAINT `attachments_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `projects_ibfk_2` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
