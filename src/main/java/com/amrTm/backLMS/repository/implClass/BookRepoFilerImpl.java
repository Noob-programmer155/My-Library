package com.amrTm.backLMS.repository.implClass;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.beans.support.MutableSortDefinition;
import org.springframework.beans.support.PagedListHolder;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Component;

import com.amrTm.backLMS.entity.Book;
import com.amrTm.backLMS.repository.BookRepoFilter;

@Component
public class BookRepoFilerImpl implements BookRepoFilter{
	@PersistenceContext
	private EntityManager entityManager;
	
	public PagedListHolder<Book> FilterBook(String title, Long user, Long publisher, List<Integer> type, int page, int size) {
		StringBuilder sb = new StringBuilder();
		if(title != null) {
			sb.append("p.title = :title");
		}
		if(user != null) {
			if(sb.indexOf("p.title")!=-1) {
				sb.append(" and");
			}
			sb.append(" bu.id = :user");
		}
		if(publisher != null) {
			if(sb.indexOf("p.title")!=-1||sb.indexOf("bu.id")!=-1) {
				sb.append(" and");
			}
			sb.append(" pb.id = :publisher");
		}
		if(type != null && !type.isEmpty()) {
			if(sb.indexOf("p.title")!=-1||sb.indexOf("bu.id")!=-1||sb.indexOf("pb.id")!=-1) {
				sb.append(" and");
			}
			sb.append(" b.id in (:type)");
		}
		Query query = entityManager.createQuery("select DISTINCT p from Book p inner join p.bookUser bu inner join p.publisherBook pb inner join p.typeBooks b where "
			+sb.toString(),Book.class);
		if(title != null) {query.setParameter("title", title);}
		if(user != null) {query.setParameter("user", user);}
		if(publisher != null) {query.setParameter("publisher", publisher);}
		if(type != null && !type.isEmpty()) {query.setParameter("type", type);}
		List<Book> dataList = query.getResultList();
		PagedListHolder<Book> data = new PagedListHolder<>(dataList);
		data.setPage(page);
		data.setPageSize(size);
		data.setSort(new MutableSortDefinition("title",true,true));
		return data;
	}
}
