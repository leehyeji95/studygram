package com.studygram.common.oauth;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class OAtuhApiResponseHeader {
    private int code;
    private String message;
}
