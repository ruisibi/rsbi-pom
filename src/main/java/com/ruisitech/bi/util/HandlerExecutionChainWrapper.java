package com.ruisitech.bi.util;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.BeanFactory;
import org.springframework.cglib.proxy.Enhancer;
import org.springframework.cglib.proxy.MethodInterceptor;
import org.springframework.cglib.proxy.MethodProxy;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerExecutionChain;

import com.ruisitech.bi.entity.common.BaseEntity;

public class HandlerExecutionChainWrapper extends HandlerExecutionChain {
	 
	private BeanFactory beanFactory;
	private HandlerMethod handlerWrapper;
	private byte[] lock = new byte[0];
	
	public HandlerExecutionChainWrapper(HandlerExecutionChain chain,
			HttpServletRequest request,
			BeanFactory beanFactory) {
		super(chain.getHandler(),chain.getInterceptors());
		this.beanFactory = beanFactory;
	}
 
	@Override
	public Object getHandler() {
		if (handlerWrapper != null) {
			return handlerWrapper;
		}
		
		synchronized (lock) {
			if (handlerWrapper != null) {
				return handlerWrapper;
			}
			HandlerMethod superMethodHandler = (HandlerMethod)super.getHandler();
			Object proxyBean = createProxyBean(superMethodHandler);
			handlerWrapper = new HandlerMethod(proxyBean,superMethodHandler.getMethod());
			return handlerWrapper;
		}
		
	}
	
	/**
	 * 为Controller Bean创建一个代理实例,以便用于 实现调用真实Controller Bean前的切面拦截
	 * 用以过滤方法参数中可能的XSS注入
	 * @param handler
	 * @return
	 */
	private Object createProxyBean(HandlerMethod handler) {
		try {
			Enhancer enhancer = new Enhancer();
			enhancer.setSuperclass(handler.getBeanType());
			Object bean = handler.getBean();
			if (bean instanceof String) {
				bean = beanFactory.getBean((String)bean);
			}
			ControllerXssInterceptor xss = new ControllerXssInterceptor(bean);
			enhancer.setCallback(xss);
			return enhancer.create();
		}catch(Exception e) {
			throw new IllegalStateException("为Controller创建代理失败:"+e.getMessage(), e);
		}
	}
	
	
	public static class ControllerXssInterceptor implements MethodInterceptor {
 
		private Object target;
		private List<String> objectMatchPackages;
		
		public ControllerXssInterceptor(Object target) {
			this.target = target;
			this.objectMatchPackages = new ArrayList<String>();
			this.objectMatchPackages.add("com.ruisitech.bi.entity");
		}
 
		@Override
		public Object intercept(Object obj, Method method, Object[] args, 
				MethodProxy proxy) 
				throws Throwable {
			
			//对Controller的方法参数进行调用前处理
			//过滤String类型参数中可能存在的XSS注入
			if (args != null) {
				for (int i=0;i<args.length;i++) {
					if (args[i]==null)
						continue;
					
					if (args[i] instanceof String) {
						args[i] = stringXssReplace((String)args[i]);
						continue;
					}
					
					for(String pk:objectMatchPackages) {
						if (args[i].getClass().getName().startsWith(pk)) {
							objectXssReplace(args[i]);
							break;
						}
					}
				}
			}
			return method.invoke(target, args);
		}
		
		private String stringXssReplace(String argument) {
			return RSBIUtils.htmlEscape(argument);
		}
		
		private void objectXssReplace(Object argument) {
			if (argument == null)
				return;
			if(argument instanceof BaseEntity){
				BaseEntity entity = (BaseEntity)argument;
				entity.validate();
			}
		}
	}
}