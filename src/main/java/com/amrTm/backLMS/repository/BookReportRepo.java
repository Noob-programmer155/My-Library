package com.amrTm.backLMS.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.BookReport;

@Repository
public interface BookReportRepo extends JpaRepository<BookReport, Long>{
	public List<BookReport> findAllByDateReportBetween(Date start, Date end);
}
