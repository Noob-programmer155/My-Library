package com.amrTm.backLMS.repository;

import java.util.Collection;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import com.amrTm.backLMS.entity.Role;
import com.amrTm.backLMS.entity.User;

@Repository
public interface UserRepo extends PagingAndSortingRepository<User,Long> {
	public Optional<User> findByEmail(String email);
	public Optional<User> findByName(String name);
	public Page<User> findAllByNameLikeOrEmailLike(String name, String email, Pageable page);
	public Page<User> findAllByRoleIn(Collection<Role> role, Pageable page);
	public Page<User> findAllByNameContainsAndRole(String words, Role role, Pageable data);
}
