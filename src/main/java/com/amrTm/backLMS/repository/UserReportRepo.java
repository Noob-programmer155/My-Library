package com.amrTm.backLMS.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.UserReport;

@Repository
public interface UserReportRepo extends JpaRepository<UserReport, Long>{
	public List<UserReport> findAllByDateReportBetween(Date start, Date end); 
}
