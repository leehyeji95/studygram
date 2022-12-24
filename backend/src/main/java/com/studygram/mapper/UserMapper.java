package com.studygram.mapper;

import com.studygram.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserMapper {
    User findByUserIdx(int idx);
    User findByUserName(String userName);
    User findByClientId(String clientId);
    User findByEmailAddr(String emailAddr);
    int save(User user);
    int updateUser(User user);
    List<User> selectAll();
}
