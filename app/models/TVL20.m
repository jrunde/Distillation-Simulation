function [ T_VL20 ] = TVL20(z,mixture_params,GCVOL_GC,Unifac_GC)
%Written by Jacob Backhaus
%TVL20 calculates the temperature of the fuel with a vapor to liquid ratio
%of 20.  

%z - global mole fraction of each component in the fuel mixture
%T_VL20 - temperature [K] for the fuel to reach 1 atm with an initial vapor
%to liquid ratio equal to 20.

T0=310.95;     %initial guess temperature [K]
%basis: 1 mL of fuel and 20 mL of gas for V/L = 20
V_tot=21;   %total system volume [mL]
V_gas=20;    %volume of gas [mL];
V_liq=1;    %liquid volume [mL]
Pf = 101.3; %[kPa]
dP=2;
tol=.001;    %calculate temperature such that final pressure is within .01 kPa
tolin = 1E-06; %tolerance for constant V constant T flash calc 
inc = 20; 
T = T0;
T1 = 273.15; 
T2 = T0; 
i=1;
max=100; 
%assumes non-reacting. Total number of moles (liquid+vapor)=constant.
[~, ~, ~, ~, P1] = VTflash(z,T1,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
dP1 = P1-Pf;
[~, ~, ~, ~, P2] = VTflash(z,T2,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
dP2 = P2-Pf; 
while abs(dP)>tol && i <max
    while(dP1*dP2>0)
        if(dP1>0)
            T1 = T1-inc; %[k]
            [~, ~, ~, ~, P1] = VTflash(z,T1,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
            dP1 = P1 - Pf;
            if(dP1<0)
                T2 = T1+inc;
                [~, ~, ~, ~, P2] = VTflash(z,T2,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
                dP2 = P2-Pf;
            end
        elseif(dP2<0)
            T2 = T2+inc;
            [~, ~, ~, ~, P2] = VTflash(z,T2,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
            dP2 = P2-Pf; 
            if(dP2>0)
                T1 = T2-inc; 
                [~, ~, ~, ~, P1] = VTflash(z,T1,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
                dP1 = P1 - Pf; 
            end
        end
    end
    %calculate middle temperature and pressure at new temperature
    T3 = (T1 + T2)/2; 
    [~, ~, ~, ~, P3] = VTflash(z,T3,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
    dP3 = P3-Pf;
    %denominator for updating temperature value
    s = sqrt(dP3*dP3-dP1*dP2); 
    %calculate better guess for temperature (essentially secant method)
    T = T3+(T3-T1)*(sign(dP1-dP2)*dP3)/s;
    %recalculate the energy balance at the new temperature
    [~, ~, ~, ~, P] = VTflash(z,T,V_liq,V_tot,tolin,mixture_params,GCVOL_GC,Unifac_GC);
    dP = P-Pf;
    %adjust end points of the interval where root is located using signs of
    %energy balance
    if(abs(dP)<tol)
        break; 
    %if dP and dP3 have different signs then T3 and T form the new
    %interval where the root is located
    elseif(dP*dP3<0) 
        T1 = T3;
        dP1 = dP3;
        T2 = T; 
        dP2 = dP; 
    elseif(dP*dP1<0)%else if dP and dP1 have different signs update T2 with T
        T2 = T; 
        dP2 = dP;
    elseif(dP*dP2<0)%else if dP and dP2 have different signs update T1 with T
        T1 = T; 
        dP1 = dP; 
    end
    i=i+1;
end

T_VL20=T;    %temperature at which the vapor to liquid ratio is equal to 20
end

