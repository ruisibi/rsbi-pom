package com.ruisitech.ext.service.frame;

import java.util.List;

import com.ruisi.ext.engine.control.InputOption;
import com.ruisi.ext.engine.scan.ResultRef;
import com.ruisi.ext.engine.service.ServiceSupport;

public class PasswordService extends ServiceSupport
{

	public void execute(InputOption option) 
	{
		
		
	}
	
	
	public void mod(InputOption option) throws Exception 
	{
		/**
		User u = VDOPUtils.getLoginedUser(option.getRequest());
		String password1 = option.getParamValue("password1");
		String password2 = option.getParamValue("password2");
		String password3 = option.getParamValue("password3");
		List ls = daoHelper.getSqlMapClientTemplate().queryForList("vdop.frame.password.check",u);
		String userPassword = (String)ls.get(0);
		if(!userPassword.equals(VDOPUtils.getEncodedStr(password1)))
		{
			option.setParamValue("flag", "n");
		}
		else
		{
			u.setPassword(VDOPUtils.getEncodedStr(password2));
			daoHelper.getSqlMapClientTemplate().update("vdop.frame.password.mod",u);
			option.setParamValue("flag", "y");
		}
		**/
	}
}
