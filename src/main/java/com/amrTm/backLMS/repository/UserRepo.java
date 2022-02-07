package com.amrTm.backLMS.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;

@Repository
public interface UserRepo extends PagingAndSortingRepository<User,Long> {
	public Optional<User> findByEmail(String email);
	public Optional<User> findByName(String name);
	@Query("select u from User u where (name like ?1 or email like ?2) and role in(?3)")
	public Page<User> findSearchUser(String name, String email, Collection<Role> role, Pageable page);
	public Page<User> findAllByRoleIn(Collection<Role> role, Pageable page);
	public Page<User> findAllByNameContainsAndRole(String words, Role role, Pageable data);
}
